import { BadRequestException, Injectable } from '@nestjs/common';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCartDto } from './dto/create-cart.dto';
import { httpErrors } from 'src/shares/exceptions';
import { GetCartDto } from './dto/get-cart.dto';
import { ProductInfo, ProductInfoDocument } from '../product-info/schemas/product-info.schema';
import { CartRepository } from './repositories/cart.repositories';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>,
    private cartRepository: CartRepository,
  ) {}

  async createCart(payload: CreateCartDto, user_id: string): Promise<void> {
    const { products } = payload;

    const cart = await this.cartModel.find({ user_id });

    if (cart) {
      throw new BadRequestException(httpErrors.CART_EXISTED);
    } else {
      await this.cartModel.create({
        user_id,
        products,
      });
    }
  }

  async find(getCartDto: GetCartDto, user_id: string): Promise<ResPagingDto<Cart[]>> {
    const { sort, page, limit, id } = getCartDto;
    const query: any = {};
    query.user_id = user_id;

    if (id) {
      query._id = id;
    }

    const [result, total] = await Promise.all([
      this.cartModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.cartModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async deleteById(_id: string, user_id: string): Promise<void> {
    await this.cartModel.deleteOne({ _id, user_id });
  }
}
