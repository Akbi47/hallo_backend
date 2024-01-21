import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductInfo, ProductInfoDocument } from '../schemas/product-info.schema';

@Injectable()
export class ProductInfoRepository {
  constructor(@InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>) {}
}
