import { Document, Schema as MongoSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CAPACITY_MODEL } from '../../capacity/schemas/capacity.schema';
import { TYPE_MODEL } from '../../type/schemas/type.schema';
import { SUPPLIER_MODEL } from 'src/modules/supplier/schemas/supplier.schema';
import { GROUP_MODEL } from 'src/modules/group/schemas/group.schema';
import { TYPE_USE_MODEL } from 'src/modules/type-use/schemas/type-use.schema';

export const PARAM_MODEL = 'params';

@Schema({ timestamps: true, collection: PARAM_MODEL })
export class Param {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: [{ type: MongoSchema.Types.ObjectId, ref: CAPACITY_MODEL }], default: [] })
  capacities: MongoSchema.Types.ObjectId[];

  @Prop({ required: false, type: [{ type: MongoSchema.Types.ObjectId, ref: TYPE_MODEL }], default: [] })
  types: MongoSchema.Types.ObjectId[];

  @Prop({ required: false, type: [{ type: MongoSchema.Types.ObjectId, ref: GROUP_MODEL }], default: [] })
  groups: MongoSchema.Types.ObjectId[];

  @Prop({ required: false, type: [{ type: MongoSchema.Types.ObjectId, ref: SUPPLIER_MODEL }], default: [] })
  suppliers: MongoSchema.Types.ObjectId[];

  @Prop({ required: false, type: [{ type: MongoSchema.Types.ObjectId, ref: TYPE_USE_MODEL }], default: [] })
  type_uses: MongoSchema.Types.ObjectId[];
}

export type ParamDocument = Param & Document;
export const ParamSchema = SchemaFactory.createForClass(Param);
