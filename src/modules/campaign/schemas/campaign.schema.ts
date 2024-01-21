import { Document, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UNITS_MODEL } from 'src/modules/unit/schema/unit.schema';
import {
  ApplyProductAndService,
  CampaignStatus,
  CampaignType,
  SubjectsToApply,
} from 'src/shares/enums/promotional.enum';
import { PRODUCT_MODEL } from 'src/modules/product/schemas/product.schema';
import { USER_MODEL } from 'src/modules/user/schemas/user.schema';

export const CAMPAIGN_MODEL = 'campaign';

@Schema({ _id: false })
export class histories {
  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  create_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  update_by?: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: USER_MODEL })
  delete_by?: string;

  @Prop({ required: false, type: JSON })
  info?: string;

  @Prop({ required: true, type: Date })
  created_at: Date;
}

export const historiesSchema = SchemaFactory.createForClass(histories);

@Schema({ timestamps: true, collection: CAMPAIGN_MODEL })
export class Campaign {
  @Prop({ required: false, type: String, default: false })
  name: string;

  @Prop({ required: false, type: String, default: false })
  code: string;

  @Prop({ required: false, type: MongooseSchema.Types.ObjectId, index: true, ref: UNITS_MODEL })
  currency_unit_id: string;

  @Prop({ required: false, type: Number, enum: SubjectsToApply })
  subjects_to_apply: number;

  @Prop({ type: String, enum: CampaignStatus, default: CampaignStatus.ACTIVE })
  status: string;

  @Prop({ required: false, type: Number, enum: ApplyProductAndService })
  type_applicable_product?: number;

  @Prop({ required: false, type: [{ type: MongooseSchema.Types.ObjectId }], index: true, ref: PRODUCT_MODEL })
  applicable_products: string[];

  @Prop({ required: false, type: Number, enum: CampaignType })
  campaign_type: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  reduction_amount?: number;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  refund_amount?: number;

  @Prop({ required: false, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  desc: string;

  @Prop({ required: false, type: [{ type: historiesSchema }] })
  histories?: histories[];
}

export type CampaignDocument = Campaign & Document;
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
