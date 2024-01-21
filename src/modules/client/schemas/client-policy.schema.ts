import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export const CLIENT_POLICY_MODEL = 'client_policy';

@Schema({ timestamps: true, collection: CLIENT_POLICY_MODEL })
export class ClientPolicy {
  @Prop({ type: String })
  name: string;

  @Prop({ required: false, type: String })
  condition: string;

  @Prop({ required: false, type: String })
  upgrade_rewards: string;

  @Prop({ required: false, type: String })
  discount_policy: string;

  @Prop({ required: false, type: String })
  birthday_policy: string;

  @Prop({ required: false, type: String })
  return_exchange_policy: string;

  @Prop({ required: false, type: String })
  warranty_policy: string;

  @Prop({ required: false, type: String })
  maintenance_requirement: string;

  @Prop({ required: false, type: String })
  member_day_promotion: string;

  @Prop({ required: false, type: String })
  free_shipping_offer: string;

  @Prop({ required: false, type: String })
  extended_benefits: string;

  @Prop({ required: false, type: String })
  top_up_upgrade_rewards: string;
}

export type ClientPolicyDocument = ClientPolicy & Document;
export const ClientPolicySchema = SchemaFactory.createForClass(ClientPolicy);
