import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UNITS_MODEL } from 'src/modules/unit/schema/unit.schema';
import { PRODUCT_MODEL } from 'src/modules/product/schemas/product.schema';
import { GROUP_MODEL } from 'src/modules/group/schemas/group.schema';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import {
  ApplyProductAndService,
  PromotionalStatus,
  SubjectsToApply,
  TypeApplyDiscount,
} from 'src/shares/enums/promotional.enum';
import { GIFT_MODEL } from 'src/modules/gift/schemas/gift.schema';
import { SHIPPING_METHOD_MODEL } from 'src/modules/shipping-method/schemas/shipping-method.schema';

export const PROMOTIONS_MODEL = 'promotions';

@Schema({ _id: false })
export class Condition {
  @Prop({ required: false, type: Number, enum: SubjectsToApply })
  subjects_to_apply: number;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: SHIPPING_METHOD_MODEL })
  shipping_method_id: string;

  @Prop({ required: false, type: Number })
  number_of_times_applier?: number;

  @Prop({ required: false, type: Number, enum: ApplyProductAndService })
  type_applicable_product?: number;

  @Prop({ required: false, type: [{ type: MongooseSchema.Types.ObjectId }], index: true, ref: PRODUCT_MODEL })
  applicable_products: string[];

  @Prop({ required: false, type: Date, index: true })
  start_date?: Date;

  @Prop({ required: false, type: Date, index: true })
  end_date?: Date;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  total_order_value_from: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  total_order_value_to: number;
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);

@Schema({ _id: false })
export class PromoInfo {
  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  bill_discount_percent?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  discount_delivery_percent?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  discount_delivery_value?: number;

  @Prop({ required: false, type: Date, index: true })
  start_date?: Date;

  @Prop({ required: false, type: Date, index: true })
  end_date?: Date;
}

export const PromoInfoSchema = SchemaFactory.createForClass(PromoInfo);

@Schema({ _id: false })
export class histories {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  create_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  update_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: string;

  @Prop({ required: false, type: JSON })
  info?: string;

  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const historiesSchema = SchemaFactory.createForClass(histories);

@Schema({ timestamps: true, collection: PROMOTIONS_MODEL })
export class Promotion {
  @Prop({ type: Number, enum: TypeApplyDiscount })
  type_apply_discount: TypeApplyDiscount;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: GROUP_MODEL })
  promotional_group_id: string;

  @Prop({ required: false, type: String, default: false })
  name: string;

  @Prop({ required: false })
  code: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  currency_unit_id: string;

  @Prop({ required: false, type: ConditionSchema })
  product_condition?: Condition;

  @Prop({ required: false, type: PromoInfoSchema })
  promo_info?: PromoInfo;

  @Prop({ required: false, type: [{ type: MongooseSchema.Types.ObjectId }], index: true, ref: GIFT_MODEL })
  gifts?: string[];

  @Prop({ required: false, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  desc: string;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: histories[];

  @Prop({ type: String, enum: PromotionalStatus, default: PromotionalStatus.ACTIVE })
  status: string;
}

export type PromotionDocument = Promotion & Document;
export const PromotionSchema = SchemaFactory.createForClass(Promotion);
