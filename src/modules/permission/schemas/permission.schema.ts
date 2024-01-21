import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema } from 'mongoose';

import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const PERMISSION_MODEL = 'permissions';

@Schema({ timestamps: true, collection: PERMISSION_MODEL })
export class Permission {
  @Prop({ required: true, type: String })
  name = '';

  @Prop({ required: true, type: [String] })
  arrayRoutes: string[] = [];

  @Prop({ required: true, type: [String] })
  endpointAccess: string[] = [];

  @Prop({ required: true, type: String })
  status = '';

  @Prop({ required: true, type: [MongooseSchema.Types.ObjectId] })
  clientUsers = [];

  @Prop({ required: true, type: [MongooseSchema.Types.ObjectId] })
  internalUsers = [];

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  created_by = new mongoose.Types.ObjectId();

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  deactivated_by = new mongoose.Types.ObjectId();
}

export type PermissionDocument = Permission & Document;
export const PermissionSchema = SchemaFactory.createForClass(Permission);
