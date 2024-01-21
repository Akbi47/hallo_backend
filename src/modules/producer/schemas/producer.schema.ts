import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const PRODUCER_MODEL = 'producer';

@Schema({ timestamps: true, collection: PRODUCER_MODEL })
export class Producer {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  code: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: false })
  policy: string;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: MongooseSchema.Types.ObjectId;
}

export type ProducerDocument = Producer & Document;
export const ProducerSchema = SchemaFactory.createForClass(Producer);
