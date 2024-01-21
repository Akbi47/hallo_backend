import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductInfoStatus } from 'src/shares/enums/product-info.enum';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { TYPE_MODEL } from 'src/modules/type/schemas/type.schema';
import { TYPE_USE_MODEL } from 'src/modules/type-use/schemas/type-use.schema';
import { GROUP_MODEL } from 'src/modules/group/schemas/group.schema';
import { UNITS_MODEL } from 'src/modules/unit/schema/unit.schema';
import { ExchangeType } from 'src/shares/enums/exchange.enum';
// import { getUrl } from 'src/modules/upload/upload.utils';
import { PRODUCER_MODEL } from 'src/modules/producer/schemas/producer.schema';
export const PRODUCT_INFOS_MODEL = 'product_infos';

@Schema({ _id: false })
export class ProducerInfo {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: PRODUCER_MODEL })
  producer_id: string;

  @Prop({ required: true, type: String })
  product_production_location: string;
}

export const ProducerInfoSchema = SchemaFactory.createForClass(ProducerInfo);

@Schema({ _id: false })
export class Attribute {
  @Prop({ required: true, type: String })
  name?: string;

  @Prop({ required: true, type: String })
  value?: string;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);

@Schema({ _id: false })
export class SellingExchange {
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  price: number;

  @Prop({ required: true, enum: ExchangeType })
  exchange_type: number;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId })
  unit_id: string;
}

export const SellingExchangeSchema = SchemaFactory.createForClass(SellingExchange);

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

@Schema({ timestamps: true, collection: PRODUCT_INFOS_MODEL })
export class ProductInfo {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: TYPE_MODEL })
  product_type_id: string;

  @Prop({ type: String, enum: ProductInfoStatus, default: ProductInfoStatus.ACTIVE })
  status: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: GROUP_MODEL })
  group_id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: TYPE_USE_MODEL })
  type_product_use_id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  currency_unit_id: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  unit_id: string;

  @Prop({ required: false, type: ProducerInfoSchema })
  producer_info?: ProducerInfo;

  @Prop({ required: false, type: [{ type: SellingExchangeSchema }] })
  selling_exchanges?: SellingExchange[];

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  default_selling_price: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  discount_price?: number;

  @Prop({ required: false, type: [{ type: String }] })
  image_url?: string[];

  @Prop({ required: false, type: String })
  desc?: string;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: histories[];

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: [{ type: AttributeSchema }] })
  attributes?: Attribute[];
}

export type ProductInfoDocument = ProductInfo & Document;
export const ProductInfoSchema = SchemaFactory.createForClass(ProductInfo);

// ProductInfoSchema.post('find', function (doc: ProductInfo[], next: () => void) {
//   doc.forEach((item: ProductInfo) => (item.image_url = item.image_url.map((_) => getUrl(_))));
//   next();
// });

// ProductInfoSchema.post('findOne', function (doc: ProductInfo, next: () => void) {
//   doc.image_url = doc.image_url.map((_) => getUrl(_));
//   next();
// });
