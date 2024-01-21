import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { SERVICE_INFO_MODEL } from 'src/modules/service-info/schemas/service-info.schema'
import { OrderPaymentMethod } from 'src/shares/enums/order.enum'
import { OldEquipmentConditionEnum, ProblemEnum, StatusEnum } from 'src/shares/enums/warranty.enum'

export const WARRANTY_MODEL = 'warranty'
@Schema({ timestamps: true, collection: WARRANTY_MODEL })
export class Warranty {

  @Prop({ required: false, type: String})
  old_product_id?: string;

  @Prop({ required: false, type: String})
  old_product_iccid?: string;

  @Prop({ required: false, type: String})
  old_product_imei?: string;

  @Prop({ required: false, type: String})
  client_name?: string;

  @Prop({ required: false, type: String})
  link_pancake?: string;

  @Prop({ required: false, type: String, ref: SERVICE_INFO_MODEL })
  old_type_service_id?: string;

  @Prop({
    required: false,
    type: Number,
    enum: OldEquipmentConditionEnum,
    default: OldEquipmentConditionEnum.chua_gui,
  })
  old_equipment_condition?: OldEquipmentConditionEnum = OldEquipmentConditionEnum.chua_gui

  @Prop({
    required: false,
    type: Number,
    enum: ProblemEnum,
    default: ProblemEnum.mang_yeu,
  })
  problem?: ProblemEnum = ProblemEnum.mang_yeu

  @Prop({ required: false, type: String})
  reason?: string;

  @Prop({ required: false, type: String})
  zip_code?: string;

  @Prop({ required: false, type: String})
  address?: string;

  @Prop({ required: false, type: String})
  new_product_imei?: string;

  @Prop({ required: false, type: String})
  new_product_id?: string;

  @Prop({ required: false, type: String})
  new_product_iccid?: string;

  @Prop({ required: false, type: String})
  new_service?: string;

  @Prop({ type: String, enum: OrderPaymentMethod })
  payment_method?: OrderPaymentMethod;

  @Prop({ required: false, type: String})
  bill_code?: string;

  @Prop({ required: false, type: String})
  surcharge?: string;

  @Prop({ required: false, type: String})
  fee_payer?: string;

  @Prop({ required: false, type: String})
  transfer_fee?: string;

  @Prop({ required: false, type: String})
  note?: string;

  @Prop({
    required: false,
    type: Number,
    enum: StatusEnum,
    default: StatusEnum.chua_xu_ly,
  })
  status?: StatusEnum = StatusEnum.chua_xu_ly

  @Prop({ required: false, type: String })
  created_by?: string

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean

}

export type WarrantyDocument = Warranty & Document
export const WarrantySchema = SchemaFactory.createForClass(Warranty)