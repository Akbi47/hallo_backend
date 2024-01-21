import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';
export const TYPE_USE_MODEL = 'type_use';

@Schema({ timestamps: true, collection: TYPE_USE_MODEL })
export class TypeUse {
  @Prop({ required: false, type: String })
  name: string;

  @Prop({ required: true, enum: TypeTypeEnum })
  type: TypeTypeEnum;
}

export type TypeUseDocument = TypeUse & Document;
export const TypeUseSchema = SchemaFactory.createForClass(TypeUse);
