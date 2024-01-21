import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export const PAYMENT_METHOD_MODEL = 'payment';

@Schema({ timestamps: true, collection: PAYMENT_METHOD_MODEL })
export class PaymentMethod {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  status: string;


  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;
}

export type PaymentMethodDocument = PaymentMethod & Document;
export const ShippingMethodSchema = SchemaFactory.createForClass(PaymentMethod);