import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
// import { getUrl } from 'src/modules/upload/upload.utils';
import { PARAMS_HIKARI_MODEL } from 'src/modules/params-hikari/schemas/params-hikari.schema'
export const SERVICE_HIKARI_MODEL = 'service_hikari'

@Schema({ timestamps: true, collection: SERVICE_HIKARI_MODEL })
export class ServiceHikari {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: PARAMS_HIKARI_MODEL,
  })
  type_house_id: MongooseSchema.Types.ObjectId

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: PARAMS_HIKARI_MODEL,
  })
  host_id: MongooseSchema.Types.ObjectId
}

export type ServiceHikariDocument = ServiceHikari & Document
export const ServiceHikariSchema = SchemaFactory.createForClass(ServiceHikari)

ServiceHikariSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.host = ret.host_id
    delete ret.host_id

    ret.house = ret.type_house_id
    delete ret.type_house_id
  },
})
