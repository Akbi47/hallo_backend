import { Injectable } from '@nestjs/common'
import { SubService, UpdateSubService } from './dto/update-sub-service-hikari.dto'
import { InjectModel } from '@nestjs/mongoose'
import { SubServiceHikari, SubServiceHikariDocument } from './schemas/sub-service-hikari.schema'
import { IdDto } from 'src/shares/dtos/param.dto'
import mongoose, { Model } from 'mongoose'
import { _ } from 'lodash'

@Injectable()
export class SubServiceHikariService {
  constructor(
    @InjectModel(SubServiceHikari.name)
    private subServiceModel: Model<SubServiceHikariDocument>
  ) {}

  async updateSubService(updateSubService: UpdateSubService, param: IdDto): Promise<void> {
    const services = (await this.subServiceModel.find({ service_id: param.id }).lean()).map((item: any) => {
      return {
        ...item,
        _id: item._id.toString(),
      }
    })

    const updateList = updateSubService.subServices.filter((item: any) => item._id)

    const deleteList = _.differenceBy(services, updateList, '_id')

    const createList = updateSubService.subServices.filter((item: any) => item._id === undefined)

    const updatePromises = updateList.map((subService) => {
      return this.subServiceModel.findByIdAndUpdate(subService._id, subService)
    })

    const createPromises = createList.map((subService) => {
      const service = new this.subServiceModel(subService)
      return service.save()
    })

    const deletePromise = deleteList.map((subService) => {
      return this.subServiceModel.deleteOne({ _id: subService._id })
    })

    await Promise.all([...updatePromises, ...createPromises, ...deletePromise])
  }
}
