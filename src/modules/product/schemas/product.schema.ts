import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PRODUCT_INFOS_MODEL } from 'src/modules/product-info/schemas/product-info.schema';
import { SERVICE_INFO_MODEL } from 'src/modules/service-info/schemas/service-info.schema';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';
import { UNITS_MODEL } from 'src/modules/unit/schema/unit.schema';
import { SUPPLIER_MODEL } from 'src/modules/supplier/schemas/supplier.schema';
// import { CLIENT_MODEL } from 'src/modules/client/schemas/client.schema';
// import { ORDER_MODEL } from 'src/modules/order/schemas/order.schema';

export const PRODUCT_MODEL = 'products';

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
  created_at: Date;
}

export const HistoriesSchema = SchemaFactory.createForClass(Histories);

@Schema({ _id: false })
export class BuyingInfo {
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  deposit: number;

  @Prop({ required: true, type: Number })
  total: number;
}

export const BuyingInfoSchema = SchemaFactory.createForClass(BuyingInfo);

@Schema({ _id: false })
export class BuyingFee {
  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  price: number;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: UNITS_MODEL, index: true })
  unit_id: string;
}

export const BuyingFeeSchema = SchemaFactory.createForClass(BuyingFee);

@Schema({ _id: false })
export class ServiceCharges {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  value: string;
}

export const ServiceChargeSchema = SchemaFactory.createForClass(ServiceCharges);

@Schema({ timestamps: true, collection: PRODUCT_MODEL })
export class Product {
  @Prop({ required: true, type: String, index: true })
  ID: string;

  @Prop({ required: false, type: String })
  name: string;

  @Prop({ required: true, type: String })
  code: string;

  @Prop({ required: false, type: String })
  desc?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: PRODUCT_INFOS_MODEL, index: true })
  product_info_id?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: SERVICE_INFO_MODEL, index: true })
  service_info_id?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: 'orders' })
  order_id?: string;

  // @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: CLIENT_MODEL })
  // client_id?: string;

  @Prop({ required: false, type: String })
  imei?: string;

  @Prop({ required: false, type: String })
  iccid?: string;

  @Prop({ required: false, type: Date })
  import_date?: Date;

  @Prop({ required: false, type: Date })
  contract_expire_date?: Date;

  @Prop({ required: false, type: Date })
  active_date?: Date;

  @Prop({ required: false, type: Date })
  inactive_date?: Date;

  @Prop({ required: true, enum: ProductStatusEnum, default: ProductStatusEnum.ACTIVE })
  status: ProductStatusEnum;

  @Prop({ required: false, type: [{ type: HistoriesSchema }] })
  histories?: Histories[];

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  saihakko_fee?: number;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: SUPPLIER_MODEL, index: true })
  supplier_id?: string;

  @Prop({ required: false, type: BuyingInfoSchema })
  buying_info?: BuyingInfo;

  @Prop({ required: false, type: BuyingFeeSchema })
  buying_fee?: BuyingFee;

  @Prop({ required: false, type: [{ type: ServiceChargeSchema }] })
  service_charges?: ServiceCharges[];

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  buying_price?: number;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: UNITS_MODEL, index: true })
  unit_id?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: UNITS_MODEL, index: true })
  currency_unit_id?: string;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
