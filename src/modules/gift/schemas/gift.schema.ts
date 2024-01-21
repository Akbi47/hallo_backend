import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { GiftStatus } from 'src/shares/enums/gift.enum';

export const GIFT_MODEL = 'gifts';

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

@Schema({ timestamps: true, collection: GIFT_MODEL })
export class Gift {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  desc: string;

  @Prop({ type: String, enum: GiftStatus, default: GiftStatus.ACTIVE })
  status: string;

  @Prop({ required: true, type: String })
  image_url: string;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: histories[];

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;
}

export type GiftDocument = Gift & Document;
export const GiftSchema = SchemaFactory.createForClass(Gift);
