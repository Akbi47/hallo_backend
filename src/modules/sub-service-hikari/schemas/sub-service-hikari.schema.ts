import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { SERVICE_HIKARI_MODEL } from 'src/modules/service-hikari/schemas/service-hikari.schema'
export const SUB_SERVICE_HIKARI_MODEL = 'sub_service_hikari'

@Schema({ timestamps: true, collection: SUB_SERVICE_HIKARI_MODEL })
export class SubServiceHikari {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: SERVICE_HIKARI_MODEL,
  })
  service_id: MongooseSchema.Types.ObjectId

  @Prop({ required: false, type: String })
  name?: string

  @Prop({ required: false, type: Number })
  cost?: number
}

export type SubServiceHikariDocument = SubServiceHikari & Document
export const SubServiceHikariSchema = SchemaFactory.createForClass(SubServiceHikari)

SubServiceHikariSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.service = ret.service_id
    delete ret.service_id
  },
})
