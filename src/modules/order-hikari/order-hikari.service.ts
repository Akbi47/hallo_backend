import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ClientStatus } from 'src/shares/enums/client.enum'
import { Client, ClientDocument } from '../client/schemas/client.schema'
import { ParamsHikari, ParamsHikariDocument } from '../params-hikari/schemas/params-hikari.schema'
import { ServiceHikari, ServiceHikariDocument } from '../service-hikari/schemas/service-hikari.schema'
import { User, UserDocument } from '../user/schemas/user.schema'
import { CreateOrderHiakriDto } from './dto/client-create-order.dto'
import { UpdateOrderHiakriDto } from './dto/client-update-order.dto'
import { GetOrderDto } from './dto/get-orders.dto'
import { OrderHikari, OrderHikariDocument } from './schemas/order-hikari.schema'
import { ExcelService } from '../excel/excel.service'
import { Response } from 'express'
import { httpErrors } from 'src/shares/exceptions'
import { SubServiceHikari, SubServiceHikariDocument } from '../sub-service-hikari/schemas/sub-service-hikari.schema'
import { ExcelOrderHikariService } from '../excel/excel-order-hikari.service'

@Injectable()
export class OrderHikariService {
  constructor(
    @InjectModel(OrderHikari.name)
    private orderHikariModel: Model<OrderHikariDocument>,
    @InjectModel(ParamsHikari.name)
    private paramsModel: Model<ParamsHikariDocument>,
    @InjectModel(ServiceHikari.name)
    private serviceHikariModel: Model<ServiceHikariDocument>,
    @InjectModel(SubServiceHikari.name)
    private subServiceHikariModel: Model<SubServiceHikariDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
    private excelService: ExcelService,
    private excelOrderHikariService: ExcelOrderHikariService
  ) {}

  populateOrder = [
    {
      path: 'sub_service_id',
      model: this.subServiceHikariModel,
      match: { deleted: false },
      select: '-__v -createdAt -updatedAt -deleted',
      populate: [
        {
          path: 'service_id',
          model: this.serviceHikariModel,
          match: { deleted: false },
          select: '-__v -createdAt -updatedAt -deleted',
          populate: [
            {
              path: 'host_id',
              model: this.paramsModel,
            },
            {
              path: 'type_house_id',
              model: this.paramsModel,
            },
          ],
        },
      ],
    },
    {
      path: 'user_id',
      model: this.userModel,
      match: { deleted: false },
      select: '-__v -createdAt -updatedAt -deleted',
    },
    {
      path: 'client_id',
      model: this.clientModel,
      match: { deleted: false },
      select: '-__v -createdAt -updatedAt -deleted',
    },
  ]

  async findDetail(id: string): Promise<any> {
    return await this.orderHikariModel.findById(id).populate(this.populateOrder)
  }

  async buildQuery(param: GetOrderDto): Promise<any> {
    const {
      code,
      user_id,
      client_id,
      order_id,
      name,
      phone,
      host_id,
      house_id,
      type_contract,
      time_contact,
      status_mode,
      status,
      start_date,
      end_date,
    } = param
    const query: any = {}

    query.deleted = false

    if (start_date || end_date) {
      if (![3, 5, 7, -2].includes(status)) {
        query.createdAt = {}
        if (start_date) {
          query.createdAt.$gte = new Date(start_date)
        }

        if (end_date) {
          query.createdAt.$lte = new Date(end_date)
        }
      } else {
        query.up_file_date = {}
        if (start_date) {
          query.up_file_date.$gte = new Date(start_date)
        }

        if (end_date) {
          query.up_file_date.$lte = new Date(end_date)
        }
      }
    }

    if (user_id) {
      query.user_id = user_id
    }

    if (client_id) {
      query.client_id = client_id
    }

    if (order_id) {
      query._id = order_id
    }

    if (code) {
      query.code = { $regex: code, $options: 'i' }
    }

    if (type_contract) {
      query.type_contract = type_contract
    }

    if (time_contact) {
      query.time_contact = time_contact
    }

    if (status !== undefined && status !== null) {
      query.status = status === -1 ? [0, 1, 2, 6] : status === -2 ? [3, 5, 7] : status
    }

    const query_service: any = {}

    // if (host_id) {
    //   query_service.host_id = host_id
    // }

    // if (house_id) {
    //   query_service.type_house_id = house_id
    // }

    const sub_services = await this.subServiceHikariModel.find(query_service).select('_id')

    query['sub_service_id'] = { $in: sub_services }

    // client query
    const query_client: any = {}

    if (name) {
      query_client.$or = [{ full_name: { $regex: name, $options: 'i' } }, { japanese_name: { $regex: name, $options: 'i' } }]
    }

    if (phone) {
      query_client.phone = { $regex: phone, $options: 'i' }
    }

    if (status_mode) {
      query_client.status_mode = status_mode
    }

    const clients = await this.clientModel.find(query_client).select('_id')

    query['client_id'] = { $in: clients }
    return query
  }

  async find(getOrderDto: GetOrderDto): Promise<any> {
    const { sort, page, limit } = getOrderDto
    const query = await this.buildQuery(getOrderDto)

    const [result, total] = await Promise.all([
      this.orderHikariModel
        .find(query)
        .populate(this.populateOrder)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.orderHikariModel.find(query).countDocuments(),
    ])

    return {
      result: result,
      total,
      lastPage: Math.ceil(10 / limit),
    }
  }

  generateCustomerCode(prefix) {
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    const customerCode = prefix + randomNumber
    return customerCode
  }

  async createOrder(createOrderHikariDto: CreateOrderHiakriDto): Promise<any> {
    if (createOrderHikariDto.client_id === null) {
      const client = await this.clientModel.create({
        ...createOrderHikariDto.client,
        code: this.generateCustomerCode('KH_'),
        status: ClientStatus.ACTIVE,
      })
      createOrderHikariDto.client_id = client._id
    }

    await this.orderHikariModel.create({ ...createOrderHikariDto, code: this.generateCustomerCode('DH_') })
  }

  async updateOrder(updateOrderHikariDto: UpdateOrderHiakriDto): Promise<any> {
    await this.clientModel.findByIdAndUpdate({ _id: updateOrderHikariDto.client_id }, updateOrderHikariDto.client, {
      new: true,
    })
    await this.orderHikariModel.findOneAndUpdate({ _id: updateOrderHikariDto._id }, updateOrderHikariDto, {
      new: true,
    })
  }

  async exportFileExcel(param: GetOrderDto, res: Response): Promise<any> {
    const query = await this.buildQuery(param)
    const orders = await this.orderHikariModel.find(query).populate(this.populateOrder)

    const orderFile = {
      code: 'Mã đơn',
      cost: 'Cước hàng tháng',
      cost_first_month: 'Cước tháng đầu tiên',
      note: 'Ghi chú',
      status: 'Tình trạng hồ sơ',
      type_contract: 'Loại hợp đồng',
    }

    const clientFile = {
      code: 'Mã khách hàng',
      address: 'Địa chỉ',
      pancake: 'Link Pancake',
      status_mode: 'Tình trạng khách hàng',
    }

    if (orders.length > 0) {
      this.excelService.exportToExcel(
        orders.map((item: any) => {
          return Object.entries(item._doc).reduce((obj, [key, value]: any) => {
            if (key === 'client_id') {
              Object.keys(clientFile).forEach((fieldClient, key): any => {
                obj[clientFile[fieldClient]] = value._doc[fieldClient]
              })
            }

            if (Object.keys(orderFile).includes(key)) {
              obj[orderFile[key]] = value
            }
            return obj
          }, {})
        }),
        res,
        'orders'
      )
    } else {
      res.send()
    }
  }
  // eslint-disable-next-line
  async deleteHikariOrders(ids: string[], userId: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const order = await this.orderHikariModel.findOne({ id })

        if (!order) {
          throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND)
        }

        await this.orderHikariModel.findOneAndUpdate({ _id: id }, { deleted: true })
      })
    )
  }

  async importFileExcel(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelOrderHikariService.importServiceInfoExcel(file, res, userId)
  }
}
