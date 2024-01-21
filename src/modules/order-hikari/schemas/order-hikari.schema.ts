import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { CLIENT_MODEL } from 'src/modules/client/schemas/client.schema'

import { SERVICE_HIKARI_MODEL } from 'src/modules/service-hikari/schemas/service-hikari.schema'
import { SUB_SERVICE_HIKARI_MODEL } from 'src/modules/sub-service-hikari/schemas/sub-service-hikari.schema'
import { USER_MODEL } from 'src/modules/user/schemas/user.schema'
import { HikariLanguageEnum, StatusEnum, TimeContactEnum, TypeContractEnum } from 'src/shares/enums/hikari.enum'

export const ORDER_MODEL = 'orders_hikari'

@Schema({ timestamps: true, collection: ORDER_MODEL })
export class OrderHikari {
  // @Prop({
  //   required: true,
  //   type: MongooseSchema.Types.ObjectId,
  //   index: true,
  //   ref: SUB_SERVICE_HIKARI_MODEL,
  // })
  // sub_service_id: MongooseSchema.Types.ObjectId

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: USER_MODEL,
  })
  user_id: MongooseSchema.Types.ObjectId

  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: CLIENT_MODEL,
  })
  client_id?: MongooseSchema.Types.ObjectId

  // @Prop({ required: false, type: Number })
  // cost_first_month?: number

  @Prop({ required: false, type: Number })
  cost?: number

  @Prop({ required: false, type: String })
  note?: string

  // @Prop({ required: false, type: Number })
  // status?: Number

  // @Prop({
  //   type: Number,
  //   enum: StatusEnum,
  //   default: StatusEnum.da_len_don,
  // })
  // status?: StatusEnum

  @Prop({ required: false, type: String })
  code?: string

  @Prop({ required: false, type: String })
  code_contract?: string

  @Prop({ required: false, type: String })
  address?: string

  @Prop({ required: false, type: Number })
  progress_file?: number

  @Prop({ required: false, type: Number })
  method_payment?: number

  @Prop({ required: false, type: Number })
  setup_time: number

  @Prop({ required: false, type: Date })
  used_date_temp: Date

  @Prop({ required: false, type: Date })
  setup_date: Date

  @Prop({ required: false, type: Date })
  send_date_temp: Date

  @Prop({ required: false, type: Date })
  pay_date_temp: Date

  @Prop({ required: false, type: Date })
  up_file_date: Date

  @Prop({ type: Boolean, default: false })
  support_setup: boolean

  @Prop({ required: false, type: Number })
  device_tp_link?: number

  @Prop({ required: false, type: Number })
  wifi_temp?: number

  @Prop({ required: false, type: String })
  code_wifi_temp?: string

  @Prop({ required: false, type: String })
  code_letters?: string

  @Prop({ required: false, type: Number })
  cancel_reason?: number

  @Prop({ required: false, type: String })
  another_cancel_reason?: string

  @Prop({ required: false, type: Number })
  cancel_file_reason?: number

  @Prop({ required: false, type: String })
  another_cancel_file_reason?: string

  @Prop({ required: false, type: Number })
  stop_contract?: number

  @Prop({ required: false, type: String })
  another_stop_contract?: string

  @Prop({
    type: Number,
    enum: HikariLanguageEnum,
    default: HikariLanguageEnum.tieng_viet,
  })
  language?: HikariLanguageEnum

  @Prop({
    type: Number,
    enum: TypeContractEnum,
    default: TypeContractEnum.khong_tu_gia_han,
  })
  type_contract?: TypeContractEnum

  @Prop({
    type: Number,
    enum: TimeContactEnum,
    default: TimeContactEnum['8h_12h'],
  })
  time_contact?: TimeContactEnum

  @Prop({ required: false, type: Boolean, default: false })
  deleted?: boolean
}

export type OrderHikariDocument = OrderHikari & Document
export const OrderHikariSchema = SchemaFactory.createForClass(OrderHikari)

OrderHikariSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.client = ret.client_id
    ret.client_id = ret.client._id

    ret.user = ret.user_id
    ret.user_id = ret.user._id

    ret.sub_service = ret.sub_service_id
    ret.sub_service_id = ret.sub_service._id
  },
})
