import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const CAPACITY_MODEL = 'capacities';

@Schema({ timestamps: true, collection: CAPACITY_MODEL })
export class Capacity {
  @Prop({ required: true, type: String })
  name: string;
}

export type CapacityDocument = Capacity & Document;
export const CapacitySchema = SchemaFactory.createForClass(Capacity);
