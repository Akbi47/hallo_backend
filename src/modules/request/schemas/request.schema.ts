// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CLIENT_MODEL } from 'src/modules/client/schemas/client.schema';

export const REQUEST_MODEL = 'requests';

@Schema({ timestamps: true, collection: REQUEST_MODEL })
export class Requests {
  @Prop({ required: false, type: String })
  email?: string;

  @Prop({ required: false, type: String })
  phone?: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: CLIENT_MODEL })
  client_id: string;

  @Prop({ required: false, type: String })
  title?: string;

  @Prop({ required: false, type: String })
  desc?: string;
}

export type RequestsDocument = Requests & Document;
export const RequestsSchema = SchemaFactory.createForClass(Requests);
