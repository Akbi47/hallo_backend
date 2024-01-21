import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const PAYMENT_METHOD_MODEL = 'payment_methods';

@Schema({ timestamps: true, collection: PAYMENT_METHOD_MODEL })
export class PaymentMethod {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String })
  desc: string;
}

export type PaymentMethodDocument = PaymentMethod & Document;
export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
