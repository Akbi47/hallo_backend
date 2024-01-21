import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import { ServiceInfo, ServiceInfoSchema } from '../service-info/schemas/service-info.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Capacity, CapacitySchema } from '../capacity/schemas/capacity.schema';
import { Contract, ContractSchema } from '../contract/schema/contracts.schema';

import { Type, TypeSchema } from '../type/schemas/type.schema';
import { TypeUse, TypeUseSchema } from '../type-use/schemas/type-use.schema';
import { Supplier, SupplierSchema } from '../supplier/schemas/supplier.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: ServiceInfo.name, schema: ServiceInfoSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: User.name, schema: UserSchema },
      { name: Capacity.name, schema: CapacitySchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Type.name, schema: TypeSchema },
      { name: TypeUse.name, schema: TypeUseSchema },
      { name: Supplier.name, schema: SupplierSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
