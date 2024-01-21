import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { GetServiceHikariDto } from './dto/get-service-hikari.dto'

import mongoose, { Model } from 'mongoose'
import { ServiceHikari, ServiceHikariDocument } from './schemas/service-hikari.schema'
import { ParamsHikari, ParamsHikariDocument } from '../params-hikari/schemas/params-hikari.schema'
import { _ } from 'lodash'
import { IdDto } from 'src/shares/dtos/param.dto'

@Injectable()
export class ServiceHikariService {
  constructor(
    @InjectModel(ServiceHikari.name)
    private serviceHikariModel: Model<ServiceHikariDocument>,
    @InjectModel(ParamsHikari.name)
    private paramsModel: Model<ParamsHikariDocument>
  ) {}

  findAggregate: any = [
    {
      $sort: {
        host_id: 1,
      },
    },
    {
      $lookup: {
        from: 'sub_service_hikari',
        localField: '_id',
        foreignField: 'service_id',
        as: 'subServices',
      },
    },
    {
      $lookup: {
        from: 'params_hikari',
        localField: 'host_id',
        foreignField: '_id',
        as: 'host',
      },
    },
    {
      $lookup: {
        from: 'params_hikari',
        localField: 'type_house_id',
        foreignField: '_id',
        as: 'type_house',
      },
    },
  ]

  async findParams(): Promise<any> {
    return await this.serviceHikariModel.aggregate(this.findAggregate)
  }

  async findAll(getServiceHikariDto: GetServiceHikariDto): Promise<any> {
    const serviceHikari = await this.serviceHikariModel.aggregate([
      ...this.findAggregate,
      ...[
        {
          $match: {
            $and: [
              {
                'host.name': {
                  $regex: getServiceHikariDto.host || '',
                  $options: 'i',
                },
              },
              {
                'type_house.name': {
                  $regex: getServiceHikariDto.type_house || '',
                  $options: 'i',
                },
              },
            ],
          },
        },
      ],
    ])

    return {
      data: {
        result: serviceHikari,
      },
    }
  }

  async find(param: IdDto): Promise<any> {
    const serviceHikari = await this.serviceHikariModel.aggregate([
      ...this.findAggregate,
      ...[
        {
          $match: {
            _id: new mongoose.Types.ObjectId(param.id),
          },
        },
      ],
    ])

    return {
      data: serviceHikari,
    }
  }
}
