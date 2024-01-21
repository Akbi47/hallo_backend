import { Module } from '@nestjs/common'
import { ParamController } from './param.controller'
import { ParamService } from './param.service'
import { Param, ParamSchema } from './schemas/param.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema'
import { Type, TypeSchema } from '../type/schemas/type.schema'
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema'
import { Group, GroupSchema } from '../group/schemas/group.schema'
import { Unit, UnitSchema } from '../unit/schema/unit.schema'
import { Device, DeviceSchema } from '../device/schemas/device.schema'
import { Contract, ContractSchema } from '../contract/schema/contracts.schema'
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema'
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema'
import { ShippingMethod, ShippingMethodSchema } from '../shipping-method/schemas/shipping-method.schema'
import { Product, ProductSchema } from '../product/schemas/product.schema'
import { Gift, GiftSchema } from '../gift/schemas/gift.schema'
import { ParamsHikari, ParamsHikariSchema } from '../params-hikari/schemas/params-hikari.schema'
import { ServiceHikari, ServiceHikariSchema } from '../service-hikari/schemas/service-hikari.schema'
import { Source, SourceSchema } from '../source/schemas/source.schema'
import { User, UserSchema } from '../user/schemas/user.schema'
import { SubServiceHikari, SubServiceHikariSchema } from '../sub-service-hikari/schemas/sub-service-hikari.schema'
import { ServiceHikariService } from '../service-hikari/service-hikari.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Param.name, schema: ParamSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Type.name, schema: TypeSchema },
      { name: Capacity.name, schema: CapacitySchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: Producer.name, schema: ProducerSchema },
      { name: ShippingMethod.name, schema: ShippingMethodSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Gift.name, schema: GiftSchema },
      { name: ParamsHikari.name, schema: ParamsHikariSchema },
      { name: ServiceHikari.name, schema: ServiceHikariSchema },
      { name: SubServiceHikari.name, schema: SubServiceHikariSchema },
      { name: Source.name, schema: SourceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ParamController],
  providers: [ParamService, ServiceHikariService],
})
export class ParamModule {}
