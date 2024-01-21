import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HikariEnum } from 'src/shares/enums/hikari.enum';

export const PARAMS_HIKARI_MODEL = 'params_hikari';

@Schema({ timestamps: true, collection: PARAMS_HIKARI_MODEL })
export class ParamsHikari {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Number, unique: false })
  isDefault: number;

  @Prop({ required: true, enum: HikariEnum, unique: false })
  type: HikariEnum;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  metadata: any;
}

export type ParamsHikariDocument = ParamsHikari & Document;
export const ParamsHikariSchema = SchemaFactory.createForClass(ParamsHikari);
