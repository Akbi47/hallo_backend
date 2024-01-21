import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ApiTags } from '@nestjs/swagger';

import { PaymentMethod, PaymentMethodSchema } from './schemas/payment-method.schema';
import { ShippingMethod, ShippingMethodSchema } from '../shipping-method/schemas/shipping-method.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { ExcelModule } from '../excel/excel.module';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';

@ApiTags('Order')
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: ShippingMethod.name, schema: ShippingMethodSchema }]),
    MongooseModule.forFeature([{ name: PaymentMethod.name, schema: PaymentMethodSchema }]),
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: ServiceInfo.name, schema: ServiceInfoSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ExcelModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderModule],
})
export class OrderModule {}
