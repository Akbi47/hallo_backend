import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceInfoController } from './service-info.controller';
import { ServiceInfoService } from './service-info.service';
import { ServiceInfo, ServiceInfoSchema } from './schemas/service-info.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { Type, TypeSchema } from '../type/schemas/type.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { ExcelModule } from '../excel/excel.module';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceInfo.name, schema: ServiceInfoSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: User.name, schema: UserSchema },
      { name: Capacity.name, schema: CapacitySchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Type.name, schema: TypeSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Producer.name, schema: ProducerSchema },
    ]),
    ExcelModule,
  ],
  controllers: [ServiceInfoController],
  providers: [ServiceInfoService],
  exports: [ServiceInfoService],
})
export class ServiceInfoModule {}
