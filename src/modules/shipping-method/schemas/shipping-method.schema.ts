import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const SHIPPING_METHOD_MODEL = 'shipping_method';

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

@Schema({ timestamps: true, collection: SHIPPING_METHOD_MODEL })
export class ShippingMethod {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: histories[];

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;
}

export type ShippingMethodDocument = ShippingMethod & Document;
export const ShippingMethodSchema = SchemaFactory.createForClass(ShippingMethod);
