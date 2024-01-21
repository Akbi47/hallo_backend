import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const CONTRACT_MODEL = 'contracts';
@Schema({ timestamps: true, collection: CONTRACT_MODEL })
export class Contract {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: String })
  policy: string;
}

export type ContractDocument = Contract & Document;
export const ContractSchema = SchemaFactory.createForClass(Contract);
