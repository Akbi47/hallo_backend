import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductInfo, ProductInfoSchema } from '../product-info/schemas/product-info.schema';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { Product, ProductSchema } from './schemas/product.schema';
import { ServiceInfoModule } from '../service-info/service-info.module';
import { ProductInfoModule } from '../product-info/product-info.module';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { Type, TypeSchema } from '../type/schemas/type.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';
import { ExcelModule } from '../excel/excel.module';
import { Order, OrderSchema } from '../order/schemas/order.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductInfo.name, schema: ProductInfoSchema },
      { name: ServiceInfo.name, schema: ServiceInfoSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: User.name, schema: UserSchema },
      { name: Capacity.name, schema: CapacitySchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Type.name, schema: TypeSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Producer.name, schema: ProducerSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    ServiceInfoModule,
    ProductInfoModule,
    ExcelModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
