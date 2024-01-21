import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { PRODUCT_INFOS_MODEL } from 'src/modules/product-info/schemas/product-info.schema';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import {
  CancelReason,
  DeliveryTime,
  OrderPaymentMethod,
  OrderPurchaseStatus,
  OrderStatus,
  OrderType,
  PackageShippingStatus,
  ReconfirmReason,
  ShippingPromotionItemsStatus,
} from 'src/shares/enums/order.enum';
// import { PAYMENT_METHOD_MODEL } from './payment-method.schema';
// import { SERVICE_INFO_MODEL } from 'src/modules/service-info/schemas/service-info.schema';
import { DEVICE_MODEL } from 'src/modules/device/schemas/device.schema';
import { SHIPPING_METHOD_MODEL } from 'src/modules/shipping-method/schemas/shipping-method.schema';
import { PROMOTIONS_MODEL } from 'src/modules/promotion/schemas/promotion.schema';
import { CLIENT_MODEL } from 'src/modules/client/schemas/client.schema';

export const ORDER_MODEL = 'orders';

export class Timestamps {
  @Prop({ required: false, type: Number })
  start_time?: number;

  @Prop({ required: false, type: Number })
  end_time?: number;
}
export class Date {
  @Prop({ required: false, type: Number })
  start_date?: number;

  @Prop({ required: false, type: Number })
  end_date?: number;
}

export class PhoneTime {
  @Prop({ required: false, type: MongooseSchema.Types.Date })
  end_time: MongooseSchema.Types.Date;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  start_time: MongooseSchema.Types.Date;
}

@Schema({ _id: false })
export class productOrderLine {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true })
  product_id: string;

  @Prop({ required: true, type: Number, default: 0 })
  quantity: number;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: DEVICE_MODEL })
  device_id: string;

  @Prop({ required: true, type: Number, default: 0 })
  monthly_fee: number;

  @Prop({ required: true, type: Number, default: 0 })
  first_month_fee: number;

  @Prop({ required: true, type: Number, default: 0 })
  next_month_fee: number;

  @Prop({ required: true, type: Date })
  extend_to: Date;

  @Prop({ required: true, type: Number, default: 0 })
  initial_fee: number;

  @Prop({ required: false, type: Number, default: 0 })
  surcharge: number;

  @Prop({ required: false, type: Number, default: 0 })
  deduction: number;

  @Prop({ required: false, type: Date })
  created_at: Date;
}

export const productOrderLineSchema = SchemaFactory.createForClass(productOrderLine);

@Schema({ timestamps: true, collection: ORDER_MODEL })
export class Order {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: CLIENT_MODEL })
  client_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: [{ type: productOrderLineSchema }] })
  product_order_line: productOrderLine[];

  // @Prop({ required: false, type: [{ type: ServiceChargeSchema }] })
  // service_charges?: ServiceCharges[];

  @Prop({ required: false, type: Boolean })
  is_service: boolean;

  @Prop({ required: true, type: String, enum: OrderType, default: OrderType.NEW_ORDER })
  type: OrderType;

  @Prop({ type: String, enum: OrderPaymentMethod })
  payment_method: OrderPaymentMethod;

  @Prop({ required: false, type: String })
  link_pancake?: string;

  @Prop({ required: false, type: String })
  name_pancake?: string;

  // @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: PAYMENT_METHOD_MODEL })
  // payment_method_id: MongooseSchema.Types.ObjectId;

  //expected time
  @Prop({ required: false, enum: DeliveryTime, default: DeliveryTime.ANY_TIME })
  delivery_time?: DeliveryTime;

  @Prop({ required: false, type: Date })
  delivery_date?: Date;

  // @Prop({ required: false, type: String })
  // shipping_type?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: SHIPPING_METHOD_MODEL })
  shipping_method_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: Number })
  shipping_fee?: number;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: PROMOTIONS_MODEL })
  promotions: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false, type: Number, default: 0 })
  promotion_quantity: number;

  @Prop({ required: false, type: String })
  describe?: string;

  @Prop({ type: String, enum: OrderPurchaseStatus, default: OrderPurchaseStatus.Potential_Customer })
  purchase_status: OrderPurchaseStatus; // tiem nang hay da chot

  //shipping info
  @Prop({ required: false, type: String })
  zip_code?: string;

  @Prop({ required: false, type: String })
  recipient_name?: string;

  @Prop({ required: false, type: String })
  recipient_phoneNumber?: string;

  @Prop({ required: false, type: String })
  shipping_address?: string;

  //shipping phase
  @Prop({ required: false, type: Date })
  shipping_at?: Date; // ngay gui

  @Prop({ required: false, type: Date })
  receive_at?: Date; //ngay nhan du kien

  @Prop({ required: false, type: String })
  shipping_bill?: string;

  @Prop({ required: false, type: String, enum: PackageShippingStatus })
  package_shipping_status?: PackageShippingStatus;

  @Prop({ required: false, type: String })
  shipping_note?: string;

  @Prop({ required: false, type: String, enum: ShippingPromotionItemsStatus })
  shipping_promotion_items_status?: ShippingPromotionItemsStatus;

  @Prop({ required: false, type: String })
  user_note?: string;

  @Prop({ required: false, type: String })
  envelope_stamp?: string; //Tem dán bì thư

  @Prop({ required: false, type: String })
  contract_stamp?: string; // tem hợp đồng

  // @Prop({ required: false, type: String })
  // language?: string;

  // @Prop({ required: false, type: String })
  // origin?: string;

  // @Prop({ required: false, type: PhoneTime })
  // phone_time?: PhoneTime;

  // @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  // deposit?: MongooseSchema.Types.Decimal128;

  //
  @Prop({ required: false, type: String, enum: CancelReason })
  cancel_reason?: CancelReason;

  @Prop({ required: false, type: String })
  cancel_note?: string;

  @Prop({ required: false, type: String, enum: ReconfirmReason })
  reconfirm_reason?: ReconfirmReason;

  @Prop({ required: false, type: String })
  reconfirm_note?: string;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  update_by?: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, enum: OrderStatus, default: OrderStatus.PENDING })
  status?: OrderStatus;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
