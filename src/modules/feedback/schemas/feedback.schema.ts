// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CLIENT_MODEL } from 'src/modules/client/schemas/client.schema';

export const FEEDBACK_MODEL = 'feedback';

@Schema({ timestamps: true, collection: FEEDBACK_MODEL })
export class Feedback {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: CLIENT_MODEL })
  client_id: string;

  @Prop({ required: false, type: String })
  title?: string;

  @Prop({ required: false, type: String })
  desc?: string;
}

export type FeedbackDocument = Feedback & Document;
export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
