import { Module } from '@nestjs/common';
import { TypeController } from './type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Type, TypeSchema } from './schemas/type.schema';
import { TypeService } from './type.service';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { ServiceInfoModule } from '../service-info/service-info.module';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';
import { ProductInfoModule } from '../product-info/product-info.module';
import { ExcelModule } from '../excel/excel.module';
import { ProductInfo, ProductInfoSchema } from '../product-info/schemas/product-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Type.name, schema: TypeSchema },
      { name: ServiceInfo.name, schema: ServiceInfoSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: User.name, schema: UserSchema },
      { name: Capacity.name, schema: CapacitySchema },
      { name: Contract.name, schema: ContractSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Producer.name, schema: ProducerSchema },
      { name: ProductInfo.name, schema: ProductInfoSchema },
    ]),
    ServiceInfoModule,
    ProductInfoModule,
    ExcelModule,
  ],
  controllers: [TypeController],
  providers: [TypeService],
})
export class TypeModule {}
