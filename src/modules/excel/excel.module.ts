import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { Type, TypeSchema } from '../type/schemas/type.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { ExcelController } from './excel.controller';
import { ExcelService } from './excel.service';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';
import { ProductInfo, ProductInfoSchema } from '../product-info/schemas/product-info.schema';
import { ExcelProductServiceTelecomService } from './excel-product-service-telecom.service';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { ExcelProductInfoService } from './excel-product-info.service';
import { ExcelServiceInfoTelecomService } from './excel-service-info-telecom.service';
import { ExcelServiceInfoService } from './excel-service-info.service';
import { ExcelProductServiceService } from './excel-product-service.service';
import { ExcelProductService } from './excel-product.service';
import { ExcelSupplierService } from './excel-supplier.service';
import { ExcelOrderService } from './excel-order-service.service';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { Source, SourceSchema } from '../source/schemas/source.schema';
import { ShippingMethod, ShippingMethodSchema } from '../shipping-method/schemas/shipping-method.schema';
import { Order, OrderSchema } from '../order/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Source.name, schema: SourceSchema },
      { name: ServiceInfo.name, schema: ServiceInfoSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Capacity.name, schema: CapacitySchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Type.name, schema: TypeSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Producer.name, schema: ProducerSchema },
      { name: ProductInfo.name, schema: ProductInfoSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Client.name, schema: ClientSchema },
      { name: ShippingMethod.name, schema: ShippingMethodSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ExcelController],
  providers: [
    ExcelService,
    ExcelProductServiceTelecomService,
    ExcelProductInfoService,
    ExcelServiceInfoTelecomService,
    ExcelServiceInfoService,
    ExcelProductServiceService,
    ExcelProductService,
    ExcelSupplierService,
    ExcelOrderService,
  ],
  exports: [
    ExcelService,
    ExcelProductServiceTelecomService,
    ExcelProductInfoService,
    ExcelServiceInfoTelecomService,
    ExcelServiceInfoService,
    ExcelProductServiceService,
    ExcelProductService,
    ExcelSupplierService,
    ExcelOrderService,
  ],
})
export class ExcelModule {}
