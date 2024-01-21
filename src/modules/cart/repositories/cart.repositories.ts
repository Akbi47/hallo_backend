import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { ProductInfo, ProductInfoDocument } from 'src/modules/product-info/schemas/product-info.schema';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';
import { GetCartDto } from '../dto/get-cart.dto';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(ProductInfo.name) private productModel: Model<ProductInfoDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async find(getCartDto: GetCartDto, user_id: string): Promise<Cart[]> {
    const { sort, page, limit } = getCartDto;
    const query: any = {};

    if (user_id) {
      query.user_id = user_id;
    }
    return this.cartModel
      .aggregate([
        { $match: { user_id: new Types.ObjectId(user_id) } },
        {
          $lookup: {
            from: 'products',
            localField: 'product_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$product' },
        { $unwind: '$user' },
        { $sort: { createdAt: sort } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ])
      .exec();
  }

  async findByUserId(_id: string, user_id: string): Promise<Cart> {
    return this.cartModel
      .findOne({ _id, user_id })
      .populate([
        { path: 'product_id', model: this.productModel },
        { path: 'user_id', model: this.userModel },
      ])
      .exec();
  }
}
