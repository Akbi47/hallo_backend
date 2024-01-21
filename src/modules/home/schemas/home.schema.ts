import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const HOME_MODEL = 'home';

@Schema({ _id: false })
export class Utilities {
  @Prop({ required: true, type: String, index: true })
  image_url: string;

  @Prop({ required: true, type: String })
  name: string;
}

export const UtilitiesSchema = SchemaFactory.createForClass(Utilities);

@Schema({ timestamps: true, collection: HOME_MODEL })
export class Home {
  @Prop({ required: true, type: [{ type: String }] })
  image_urls?: string[];

  @Prop({ required: true, type: [{ type: UtilitiesSchema }] })
  utilities: Utilities[];
}

export type HomeDocument = Home & Document;
export const HomeSchema = SchemaFactory.createForClass(Home);
