import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export const DEPARTMENT_MODEL = 'department';

@Schema({ timestamps: true, collection: DEPARTMENT_MODEL })
export class Department {
  @Prop({ type: String })
  name: string;

  @Prop({ required: false, type: String })
  created_by: string;

  @Prop({ required: false, type: String })
  updated_by: string;
}

export type DepartmentDocument = Department & Document;
export const DepartmentSchema = SchemaFactory.createForClass(Department);
