import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { ServiceInfoStatus, BuyType } from 'src/shares/enums/service-info.enum';
import { CAPACITY_MODEL } from 'src/modules/capacity/schemas/capacity.schema';
import { GROUP_MODEL } from '../../group/schemas/group.schema';
import { CONTRACT_MODEL } from 'src/modules/contract/schema/contracts.schema';
import { UNITS_MODEL } from 'src/modules/unit/schema/unit.schema';
import { TYPE_MODEL } from 'src/modules/type/schemas/type.schema';
// import { getUrl } from 'src/modules/upload/upload.utils';
import { TYPE_USE_MODEL } from '../../type-use/schemas/type-use.schema';
import { PRODUCER_MODEL } from 'src/modules/producer/schemas/producer.schema';
export const SERVICE_INFO_MODEL = 'service_infos';

@Schema({ _id: false })
export class ProducerInfo {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: PRODUCER_MODEL })
  producer_id?: string;

  @Prop({ required: true, type: String })
  service_production_location?: string;
}

export const producerInfoSchema = SchemaFactory.createForClass(ProducerInfo);

@Schema({ _id: false })
export class ServiceCharge {
  @Prop({ required: true, type: String })
  name?: string;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  price?: number;
}

export const ServiceChargeSchema = SchemaFactory.createForClass(ServiceCharge);

@Schema({ _id: false })
export class OtherFee {
  @Prop({ required: true, type: String })
  name?: string;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  price?: number;
}

export const OtherFeeSchema = SchemaFactory.createForClass(OtherFee);

@Schema({ _id: false })
export class BuyingFee {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  unit_id?: string;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  price?: number;
}

export const BuyingFeeSchema = SchemaFactory.createForClass(BuyingFee);

@Schema({ _id: false })
export class SellingFee {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  unit_id?: string;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  price?: number;
}

export const sellingFeeSchema = SchemaFactory.createForClass(SellingFee);

@Schema({ _id: false })
export class SellingInfo {
  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  deposit?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  activation_fee?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  network_opening_fee?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  other_fee?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  total?: number;
}

export const SellingInfoSchema = SchemaFactory.createForClass(SellingInfo);

@Schema({ _id: false })
export class Histories {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  create_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  update_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: string;

  @Prop({ required: false, type: JSON })
  info?: string;

  @Prop({ required: true, type: Date })
  created_at?: Date;
}

export const historiesSchema = SchemaFactory.createForClass(Histories);

@Schema({ _id: false })
export class SellingExchange {
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  price: number;

  @Prop({ required: true, type: Number })
  exchange_type: number;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  unit_id: string;
}

export const SellingExchangeSchema = SchemaFactory.createForClass(SellingExchange);

@Schema({ _id: false })
export class Attribute {
  @Prop({ required: true, type: String })
  name?: string;

  @Prop({ required: true, type: String })
  value?: string;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);

@Schema({ timestamps: true, collection: SERVICE_INFO_MODEL })
export class ServiceInfo {
  @Prop({ required: true, type: String, index: true })
  code?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: TYPE_MODEL })
  type_service_id?: string;

  @Prop({ required: true, type: String, index: true })
  name?: string;

  @Prop({ required: false, enum: BuyType, default: BuyType.FULL, index: true })
  buy_type?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: GROUP_MODEL })
  service_group_id?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: CAPACITY_MODEL })
  capacity_id?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: CONTRACT_MODEL })
  contract_id?: string;

  // bán  hay tặng
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: TYPE_USE_MODEL })
  type_service_use_id?: string;

  @Prop({ required: false, type: producerInfoSchema })
  producer_info?: ProducerInfo;

  @Prop({ required: false, type: [{ type: OtherFeeSchema }] })
  other_fees?: OtherFee[];

  @Prop({ required: false, type: sellingFeeSchema })
  selling_fee?: SellingFee;

  @Prop({ required: false, type: SellingInfoSchema })
  selling_info?: SellingInfo;

  @Prop({ required: false, type: [{ type: String }] })
  image_url?: string[];

  @Prop({ required: false, type: String })
  desc?: string;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: Histories[];

  @Prop({ required: false, type: [{ type: SellingExchangeSchema }] })
  selling_exchanges?: SellingExchange[];

  @Prop({ required: false, enum: ServiceInfoStatus, default: ServiceInfoStatus.ACTIVE })
  status?: ServiceInfoStatus;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  currency_unit_id: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  unit_id: string;

  @Prop({ required: false, type: [{ type: AttributeSchema }] })
  attributes?: Attribute[];

  @Prop({ required: false, type: [{ type: ServiceChargeSchema }] })
  service_charges?: ServiceCharge[];

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  default_selling_price?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  discount_price?: number;
}

export type ServiceInfoDocument = ServiceInfo & Document;
export const ServiceInfoSchema = SchemaFactory.createForClass(ServiceInfo);

// ServiceInfoSchema.post('find', function (doc: ServiceInfo[], next: () => void) {
//   doc.forEach((item: ServiceInfo) => (item.image_url = item.image_url.map((_) => getUrl(_))));
//   next();
// });

// ServiceInfoSchema.post('findOne', function (doc: ServiceInfo, next: () => void) {
//   doc.image_url = doc.image_url.map((_) => getUrl(_));
//   next();
// });
