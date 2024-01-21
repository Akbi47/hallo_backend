import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';
import { GROUP_MODEL } from 'src/modules/group/schemas/group.schema';

export const TYPE_MODEL = 'types';

@Schema({ timestamps: true, collection: TYPE_MODEL })
export class Type {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  desc: string;

  @Prop({ required: true, type: Number, unique: true })
  code: number;

  @Prop({ required: true, enum: TypeTypeEnum })
  type: TypeTypeEnum;

  @Prop({ required: false, type: String })
  image_url?: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, index: true, ref: GROUP_MODEL })
  group_id: string;
}

export type TypeDocument = Type & Document;
export const TypeSchema = SchemaFactory.createForClass(Type);
