import { Module } from '@nestjs/common';
import { ProductInfoController } from './product-info.controller';
import { ProductInfoService } from './product-info.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductInfo, ProductInfoSchema } from './schemas/product-info.schema';
import { ProductInfoRepository } from './repositories/product-info.repository';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { Type, TypeSchema } from '../type/schemas/type.schema';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductInfo.name, schema: ProductInfoSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: ServiceInfo.name, schema: ServiceInfoSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: User.name, schema: UserSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: Type.name, schema: TypeSchema },
      { name: Producer.name, schema: ProducerSchema },
    ]),

    ExcelModule,
  ],
  controllers: [ProductInfoController],
  providers: [ProductInfoService, ProductInfoRepository],
  exports: [ProductInfoService],
})
export class ProductInfoModule {}
