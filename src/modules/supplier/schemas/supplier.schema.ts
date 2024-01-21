import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';
import { SupplierStatus } from 'src/shares/enums/supplier.enum';
import { TYPE_MODEL } from 'src/modules/type/schemas/type.schema';

export const SUPPLIER_MODEL = 'supplier';

@Schema({ _id: false })
export class Histories {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  create_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  update_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: string;

  @Prop({ required: false, type: JSON })
  info?: string;

  @Prop({ required: true, type: Date })
  created_at?: Date;
}

export const historiesSchema = SchemaFactory.createForClass(Histories);

@Schema({ timestamps: true, collection: SUPPLIER_MODEL })
export class Supplier {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  code: string;

  @Prop({ required: false, enum: SupplierStatus, default: SupplierStatus.ACTIVE })
  status?: SupplierStatus;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: TYPE_MODEL })
  type_id?: string;

  @Prop({ required: false, type: [{ type: String }] })
  image_url?: string[];

  @Prop({ required: false, type: String })
  desc?: string;

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: Histories[];
}

export type SupplierDocument = Supplier & Document;
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
