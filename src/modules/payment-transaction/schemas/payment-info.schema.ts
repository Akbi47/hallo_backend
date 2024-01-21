import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentStatus } from 'src/shares/enums/payment.enum';

export const PAYMENT_INFO_MODEL = 'payment_infos';

@Schema({ timestamps: true, collection: PAYMENT_INFO_MODEL })
export class PaymentInfo {
  @Prop({ required: false, type: String, index: true })
  event_id: string;

  @Prop({ required: true, type: String, index: true })
  session_id: string;

  @Prop({ required: false, type: String, index: true })
  payment_intent_id: string;

  @Prop({ required: true, type: String, index: true })
  object: string;

  @Prop({ required: true, type: String, index: true })
  currency: string;

  @Prop({ required: true, type: Date, index: true })
  created: Date;

  @Prop({ required: true, type: Date, index: true })
  expires_at: Date;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  amount_subtotal: number;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  amount_total: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128, default: 0 })
  amount_refunded: number;

  @Prop({ required: true, type: String })
  payment_info: string;

  @Prop({ required: true, type: String, index: true })
  link_payment: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: string;
}

export type PaymentInfoDocument = PaymentInfo & Document;
export const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);
