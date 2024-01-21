import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { AdminSeeder } from './admin-seeder.console';
import { MongooseModule } from '@nestjs/mongoose';
import { Type, TypeSchema } from '../type/schemas/type.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { Param, ParamSchema } from '../param/schemas/param.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';
import { Device, DeviceSchema } from '../device/schemas/device.schema';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Client, ClientSchema } from '../client/schemas/client.schema';
import { UsersModule } from '../user/user.module';
import { ClientModule } from '../client/client.module';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { ProductInfo, ProductInfoSchema } from '../product-info/schemas/product-info.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';
import { Producer, ProducerSchema } from '../producer/schemas/producer.schema';
import { ParamsHikari, ParamsHikariSchema } from '../params-hikari/schemas/params-hikari.schema';
import { Home, HomeSchema } from '../home/schemas/home.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Type.name, schema: TypeSchema },
      { name: Group.name, schema: GroupSchema },
      { name: Capacity.name, schema: CapacitySchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Param.name, schema: ParamSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: ServiceInfo.name, schema: ServiceInfoSchema },
      { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: ProductInfo.name, schema: ProductInfoSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Producer.name, schema: ProducerSchema },
      { name: ParamsHikari.name, schema: ParamsHikariSchema },
      { name: Home.name, schema: HomeSchema },
    ]),
    UsersModule,
    ClientModule,
  ],
  providers: [SeederService, AdminSeeder],
})
export class SeederModule {}
