import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema } from 'mongoose'
import { Client, ClientDocument } from '../client/schemas/client.schema'
import { Warranty, WarrantyDocument } from '../warranty/schemas/warranty.schema'
import { GetWarrantyDto } from './dto/get-warranties.dto'
import { CreateWarrantyDto } from './dto/create-warranties.dto'
import { httpErrors } from 'src/shares/exceptions'
import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema'
import { ProductModule } from '../product/product.module'
import { Product } from '../product/schemas/product.schema'
import { OrderModule } from '../order/order.module'
import { Order } from '../order/schemas/order.schema'
import { GetClientDto } from './dto/get-client-info.dto'
import { IdDto } from 'src/shares/dtos/param.dto'

@Injectable()
export class WarrantyService {
  constructor(
    @InjectModel(Client.name)
    private clientModel: Model<ClientDocument>,
    @InjectModel(Warranty.name)
    private warrantyModel: Model<WarrantyDocument>,
    @InjectModel(ServiceInfo.name)
    private serviceInfoModel: Model<ServiceInfoDocument>,
    @InjectModel(Product.name)
    private productModel: Model<ProductModule>,
    @InjectModel(Order.name)
    private orderModel: Model<OrderModule>,
  ) {}
  populateOrder = [
    {
      path: 'client_id',
      model: this.clientModel,
      match: { deleted: false },
      select: 'name',
    },
  ]
  product: any
  async buildQuery(param: GetWarrantyDto): Promise<any> {
    const { client_name, old_type_service_id, status, old_product_id, old_product_iccid, start_date, end_date } = param
    const query: any = { deleted: false }

    if (client_name) {
      query.client_name = { $regex: client_name, $options: 'i' }
    }

    if (old_product_id) {
      query.old_product_id = { $regex: old_product_id, $options: 'i' }
    }

    if (old_product_iccid) {
      query.old_product_iccid = { $regex: old_product_iccid, $options: 'i' }
    }

    if (status) {
      query.status = status
    }

    if (old_type_service_id) {
      query.old_type_service_id = old_type_service_id
      const populateProduct = [
        {
          path: 'service_info_id',
          model: this.serviceInfoModel,
          match: { deleted: false, type_service_id: old_type_service_id },
          select: '-__v -createdAt -updatedAt -deleted',
        },
      ]
      const queryServiceName = {
        $or: [{ ID: old_product_id }, { iccid: old_product_iccid }],
        deleted: false,
      }
      this.product = await this.productModel.find(queryServiceName).select('_id').populate(populateProduct)
    }

    if (start_date && !end_date) {
      query.createdAt = {
        $gte: start_date,
      }
    }

    if (!start_date && end_date) {
      query.createdAt = {
        $lte: end_date,
      }
    }

    if (start_date && end_date) {
      query.createdAt = {
        $gte: start_date,
        $lte: end_date,
      }
    }

    return query
  }
  async buildProductQuery(param: GetClientDto): Promise<any> {
    const { old_product_id, old_product_iccid, old_product_imei } = param

    const query: any = {}
    let findProductId: unknown

    if (old_product_imei) {
      const query_product: any = { deleted: false }
      query_product.imei = { $regex: old_product_imei, $options: 'i' }
      findProductId = await this.productModel.find(query_product).select('_id')
      query['_id'] = findProductId[0]['_id'].toString()
    }

    if (old_product_iccid) {
      const query_product: any = { deleted: false }
      query_product.iccid = { $regex: old_product_iccid, $options: 'i' }
      findProductId = await this.productModel.find(query_product).select('_id')
      query['_id'] = findProductId[0]['_id'].toString()
    }

    if (old_product_id) {
      const query_product: any = { deleted: false }
      query_product.ID = { $regex: old_product_id, $options: 'i' }
      findProductId = await this.productModel.find(query_product).select('_id')
      query['_id'] = findProductId[0]['_id'].toString()
    }

    return query
  }

  async find(getWarrantyDto: GetWarrantyDto): Promise<any> {
    const { sort, page, limit } = getWarrantyDto
    const query = await this.buildQuery(getWarrantyDto)
    const res = []
    const [result, total] = await Promise.all([
      this.warrantyModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.warrantyModel.find(query).countDocuments(),
    ])
    if (query['old_type_service_id']) {
      res.push(...result, ...this.product)
    }
    return {
      result: query['old_type_service_id'] ? res : result,
      total,
      lastPage: Math.ceil(10 / limit),
    }
  }

  async findById(id: string): Promise<any> {
    return await this.warrantyModel.findById(id)
  }

  async findClient(getClientDto: GetClientDto): Promise<any> {
    const { sort, page, limit } = getClientDto
    const query = await this.buildProductQuery(getClientDto)
    const serviceInfoId = await this.productModel.findById(query['_id']).select('service_info_id')
    const service_name = await this.serviceInfoModel.findById(serviceInfoId['_id'].toString()).select('name')
    const [result, total]: [Array<unknown>, number] = await Promise.all([
      this.orderModel
        .find({
          deleted: false,
          product_order_line: {
            $elemMatch: { product_id: query['_id'] },
          },
        })
        .select('link_pancake')
        .populate(this.populateOrder)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.orderModel.find(query).countDocuments(),
    ])

    return {
      result: result[0],
      service_name: service_name ? service_name['name'] : '',
      total,
      lastPage: Math.ceil(10 / limit),
    }
  }

  async findServiceName(getClientDto: GetClientDto): Promise<any> {
    const query = await this.buildProductQuery(getClientDto)
    const serviceName = await this.productModel.findById(query['_id']).select('name')
    return serviceName
  }

  async findClientByLinkPancake(link_pancake: string): Promise<any> {
    const query: any = { deleted: false }
    query.link_pancake = { $regex: link_pancake, $options: 'i' }
    const arrData = await this.orderModel.find(query).populate(this.populateOrder)

    const data = arrData[0]
    const name = data['client_id']['name']

    const productIds = data['product_order_line'].map(item => item.product_id.toString());
    const products = await this.productModel.find({ product_id: { $in: productIds } }).select('ID imei iccid name');

    const res = {name, products}
    return res
  }

  async create(createWarrantyDto: CreateWarrantyDto): Promise<any> {
    await this.warrantyModel.create({ ...createWarrantyDto })
  }

  async delete(_id: string): Promise<any> {
    const warranty = await this.warrantyModel.findOne({ _id })
    if (!warranty) {
      throw new BadRequestException(httpErrors.ATTRIBUTE_NOT_FOUND)
    }
    await this.warrantyModel.findOneAndUpdate({ _id }, { deleted: true }, { new: true })
  }

  async update(args: GetWarrantyDto, _id: IdDto): Promise<any> {
    const warranty = await this.warrantyModel.findOne({ _id })
    if (!warranty) {
      throw new BadRequestException(httpErrors.ATTRIBUTE_NOT_FOUND)
    }
    await this.warrantyModel.findOneAndUpdate({ _id }, { ...args }, { new: true })
  }
}
