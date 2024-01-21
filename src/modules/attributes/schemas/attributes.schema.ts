import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const ATTRIBUTE_MODEL = 'attributes';

@Schema({ timestamps: true, collection: ATTRIBUTE_MODEL })
export class Attribute {
  @Prop({ required: false })
  name?: string;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  activation_price?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  price?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  service_opening_price?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  monthly_fee?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false })
  desc?: string;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: MongooseSchema.Types.ObjectId;
}

export type AttributeDocument = Attribute & Document;
export const AttributeSchema = SchemaFactory.createForClass(Attribute);
