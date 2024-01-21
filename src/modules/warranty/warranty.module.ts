import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../user/schemas/user.schema'
import { Client, ClientSchema } from '../client/schemas/client.schema'
import { ExcelModule } from '../excel/excel.module'
import { Warranty, WarrantySchema } from '../warranty/schemas/warranty.schema'
import { WarrantyService } from './warranty.service'
import { WarrantyController } from './warranty.controller'
import { Order, OrderSchema } from '../order/schemas/order.schema'
import { Product, ProductSchema } from '../product/schemas/product.schema'
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema},
      { name: ServiceInfo.name, schema: ServiceInfoSchema},
      { name: Order.name, schema: OrderSchema},
      { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Warranty.name, schema: WarrantySchema },
    ]),
    ExcelModule
  ],
  controllers: [WarrantyController],
  providers: [WarrantyService],
})
export class WarrantyModule {}
