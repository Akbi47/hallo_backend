import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export const PAYMENT_METHOD_MODEL = 'address_shipping';

@Schema({ timestamps: true, collection: PAYMENT_METHOD_MODEL })
export class AddressShippingMethod {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: number;

  @Prop({ required: true })
  address?: string;

  @Prop({ required: true })
  default: string;

}

export type AddresShippingMethodDocument = AddressShippingMethod & Document;
export const AddressShippingMethodSchema = SchemaFactory.createForClass(AddressShippingMethod);