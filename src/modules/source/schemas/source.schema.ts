import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export const SOURCE_MODEL = 'source';

@Schema({ timestamps: true, collection: SOURCE_MODEL })
export class Source {
  @Prop({ type: String })
  name: string;

  @Prop({ required: false, type: String })
  language: string;

  @Prop({ required: false, type: String })
  created_by: string;

  @Prop({ required: false, type: String })
  updated_by: string;
}

export type SourceDocument = Source & Document;
export const SourceSchema = SchemaFactory.createForClass(Source);
