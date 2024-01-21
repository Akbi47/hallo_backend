import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart, CartSchema } from './schemas/cart.schema';
import { ProductInfo, ProductInfoSchema } from '../product-info/schemas/product-info.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { CartRepository } from './repositories/cart.repositories';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: ProductInfo.name, schema: ProductInfoSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule {}
