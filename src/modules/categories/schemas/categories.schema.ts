import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
export const CATEGORIES_MODEL = 'categories';

@Schema({ timestamps: true, collection: CATEGORIES_MODEL })
export class Categories {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  description?: string;

  @Prop({ required: false, type: Number, default: 0 })
  quantity?: number;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: MongooseSchema.Types.ObjectId;
}

export type CategoriesDocument = Categories & Document;
export const CategoriesSchema = SchemaFactory.createForClass(Categories);
