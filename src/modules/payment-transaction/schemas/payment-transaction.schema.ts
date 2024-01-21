import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PAYMENT_INFO_MODEL } from './payment-info.schema';

export const PAYMENT_TRANSACTION_MODEL = 'payment_transactions';

@Schema({ timestamps: true, collection: PAYMENT_TRANSACTION_MODEL })
export class PaymentTransaction {
  @Prop({ required: true, type: String, index: true })
  event_id: string;

  @Prop({ required: true, type: Date, index: true })
  created: Date;

  @Prop({ required: true, type: Boolean })
  livemode: boolean;

  @Prop({ required: true, type: Number })
  pending_webhooks: number;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: false, type: String })
  event_info?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, ref: PAYMENT_INFO_MODEL, index: true })
  payment_info_id?: string;
}

export type PaymentTransactionDocument = PaymentTransaction & Document;
export const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransaction);
