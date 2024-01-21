import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { DEPARTMENT_MODEL } from 'src/modules/department/schemas/department.schema';
import { PRODUCT_INFOS_MODEL } from 'src/modules/product-info/schemas/product-info.schema';
import { SOURCE_MODEL } from 'src/modules/source/schemas/source.schema';
import { ClientRole, ClientStatus, ClientStatusMode } from 'src/shares/enums/client.enum';
import { CLIENT_POLICY_MODEL } from './client-policy.schema';
export const CLIENT_MODEL = 'clients';

@Schema({ _id: false })
export class ClientProduct {
  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: PRODUCT_INFOS_MODEL,
  })
  product_id: string;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  end_time: MongooseSchema.Types.Date;

  @Prop({ required: false, type: MongooseSchema.Types.Date })
  start_time: MongooseSchema.Types.Date;
}

export const ClientProductSchema = SchemaFactory.createForClass(ClientProduct);

@Schema({ timestamps: true, collection: CLIENT_MODEL })
export class Client {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String, sparse: true })
  code: string;

  @Prop({ type: String, select: false })
  @Exclude()
  password: string;

  @Prop({ type: [String] })
  address: string[];

  @Prop({ type: String })
  full_name: string;

  @Prop({ type: String })
  japanese_name: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ type: Number })
  gender: number;

  @Prop({
    type: [{ type: Number, enum: ClientRole }],
    default: [ClientRole.khach_hang],
  })
  role: ClientRole[];

  @Prop({ required: false, type: String })
  pancake: string;

  @Prop({ required: false, type: String })
  full_name_extra: string;

  @Prop({ required: false, type: String })
  pancake_extra: string;

  @Prop({ required: false, type: String, default: null })
  counselor_id: string;

  @Prop({ required: false, type: String, default: null, ref: SOURCE_MODEL })
  source_id: string;

  @Prop({ required: false, type: String })
  zip_code: string;

  @Prop({ required: false, type: String })
  image_url: string;

  @Prop({ required: false, type: String })
  created_by: string;

  @Prop({ required: false, type: String })
  update_by: string;

  @Prop({ required: false, type: String })
  token_app: string;

  @Prop({ required: false, type: Date })
  token_deadline: Date;

  @Prop({ required: false, type: String, default: null, ref: DEPARTMENT_MODEL })
  department_id: string;

  @Prop({ type: Boolean, default: false })
  is_verify: boolean;

  @Prop({ type: Boolean, default: false })
  is_banned: boolean;

  @Prop({ required: false, type: [{ type: ClientProductSchema }] })
  client_products: ClientProduct[];

  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: CLIENT_POLICY_MODEL,
  })
  client_policy_id: string;

  @Prop({ required: false, type: Boolean })
  in_call: boolean;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  exp_point?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  token_points?: MongooseSchema.Types.Decimal128;

  @Prop({ required: false, type: MongooseSchema.Types.Decimal128 })
  reward_points?: MongooseSchema.Types.Decimal128;

  @Prop({ type: String, enum: ClientStatus, default: ClientStatus.INACTIVE })
  status: ClientStatus;

  @Prop({
    type: Number,
    enum: ClientStatusMode,
    default: ClientStatusMode.tiem_nang,
  })
  status_mode: ClientStatusMode;

  @Prop({ type: String })
  facebook_id: string;

  @Prop({ type: String })
  google_id: string;

  @Prop({ type: Date })
  last_login_at: Date;

  @Prop({ type: String })
  method_contact: string;

  @Prop({ required: false, type: [{ type: String }] })
  alien_registration_cards?: string[];

  @Prop({ required: false, type: [{ type: String }] })
  passport?: string[];

  @Prop({ required: false, type: [{ type: String }] })
  bank_card?: string[];
}

export type ClientDocument = Client & Document;
export const ClientSchema = SchemaFactory.createForClass(Client);
