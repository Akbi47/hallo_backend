import { Module } from '@nestjs/common';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';
import { Unit, UnitSchema } from '../unit/schema/unit.schema';
import { Group, GroupSchema } from '../group/schemas/group.schema';
import { ShippingMethod, ShippingMethodSchema } from '../shipping-method/schemas/shipping-method.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
      { name: Unit.name, schema: UnitSchema },
      { name: Group.name, schema: GroupSchema },
      { name: ShippingMethod.name, schema: ShippingMethodSchema },
    ]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule {}
