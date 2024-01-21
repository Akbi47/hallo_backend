import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { DeviceStatus } from 'src/shares/enums/device.enum';

export const DEVICE_MODEL = 'devices';

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
  created_at?: Date;
}

export const historiesSchema = SchemaFactory.createForClass(histories);

@Schema({ timestamps: true, collection: DEVICE_MODEL })
export class Device {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: DeviceStatus, default: DeviceStatus.ACTIVE })
  status: DeviceStatus;

  @Prop({ required: false })
  desc: string;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  buying_price?: MongooseSchema.Types.Decimal128;

  @Prop({ required: true, type: MongooseSchema.Types.Decimal128 })
  selling_price?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: histories[];

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: String })
  currency?: string;
}

export type DeviceDocument = Device & Document;
export const DeviceSchema = SchemaFactory.createForClass(Device);
