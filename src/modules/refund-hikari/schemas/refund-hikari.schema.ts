import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ORDER_MODEL } from 'src/modules/order-hikari/schemas/order-hikari.schema';

export const REFUND_MODEL = 'refunds_hikari';

@Schema({ timestamps: true, collection: REFUND_MODEL })
export class RefundHikari {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: ORDER_MODEL,
  })
  order_hikari_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: false, type: Date })
  refund_time: Date;

  @Prop({ required: false, type: Number })
  reason?: number;

  @Prop({ required: false, type: String })
  another_reason?: string;

  @Prop({ required: false, type: Number })
  cost?: number;

  @Prop({ type: Boolean, default: false })
  card?: boolean;

  @Prop({ required: false, type: [{ type: String }] })
  information_card?: string[];

  @Prop({ required: false, type: String })
  note?: string;
}

export type RefundHikariDocument = RefundHikari & Document;
export const RefundHikariSchema = SchemaFactory.createForClass(RefundHikari);
