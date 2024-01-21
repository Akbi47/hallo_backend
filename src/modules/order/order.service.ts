import { Injectable, BadRequestException } from '@nestjs/common';
import { Order, OrderDocument } from './schemas/order.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { httpErrors } from 'src/shares/exceptions';
import { GetClientOrderDto, GetOrderDto } from './dto/get-orders.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { CreateOrderDtoAdmin, CreateOrderDtoClient } from './dto/create-order.dto';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import { generateCustomerCode } from 'src/shares/helpers/transformer';
import { ClientStatus } from 'src/shares/enums/client.enum';
import { User, UserDocument } from '../user/schemas/user.schema';
import { InjectConnection } from '@nestjs/mongoose';

import {
  AddOrderLine,
  CancelOrder,
  ChangeBulkStatus,
  ChangeStatus,
  ReconfirmOrder,
  updateOrderDto,
  updateShippingInfoDto,
} from './dto/update-order.dto';
import { Response } from 'express';
import { ExcelService } from '../excel/excel.service';
import { OrderStatus } from 'src/shares/enums/order.enum';
import { ExcelOrderService } from '../excel/excel-order-service.service';
import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,

    private excelService: ExcelService,
    private excelOrder: ExcelOrderService,
  ) {}

  getPipelineOrder(condition: any): any[] {
    // return [
    //   {
    //     $unwind: '$product_order_line', // Unwind the product_order_line array
    //   },
    //   {
    //     $lookup: {
    //       from: 'productinfo', // Your product info collection
    //       localField: 'product_order_line.item_id',
    //       foreignField: '_id',
    //       as: 'product_info',
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'serviceinfo', // Your service info collection
    //       localField: 'product_order_line.item_id',
    //       foreignField: '_id',
    //       as: 'service_info',
    //     },
    //   },
    //   {
    //     $addFields: {
    //       product_info: { $arrayElemAt: ['$product_info', 0] },
    //       service_info: { $arrayElemAt: ['$service_info', 0] },
    //     },
    //   },
    //   {
    //     $addFields: {
    //       'product_order_line.product_info': '$product_info',
    //       'product_order_line.service_info': '$service_info',
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$_id', // Group back by order ID
    //       product_order_line: { $push: '$product_order_line' }, // Reconstruct the array
    //     },
    //   },
    // ];
    return [
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'clients',
          localField: 'client_id',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $lookup: {
          from: 'shipping_methods',
          localField: 'shipping_method_id',
          foreignField: '_id',
          as: 'shipping_method',
        },
      },

      {
        $lookup: {
          from: 'service_infos',
          localField: 'product_order_line.product_id',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                deleted: false,
              },
            },
            {
              $lookup: {
                from: 'contracts',
                localField: 'contract_id',
                foreignField: '_id',
                as: 'contracts',
              },
            },
            {
              $unwind: '$contracts',
            },
          ],
          as: 'product_info',
        },
      },
      // {
      //   $lookup: {
      //     from: 'product_infos',
      //     localField: 'product_order_line.product_id',
      //     foreignField: '_id',
      //     pipeline: [
      //       {
      //         $match: {
      //           deleted: false,
      //         },
      //       },
      //       // {
      //       //   $lookup: {
      //       //     from: 'contracts',
      //       //     localField: 'contract_id',
      //       //     foreignField: '_id',
      //       //     as: 'contracts',
      //       //   },
      //       // },
      //       // {
      //       //   $unwind: '$contracts',
      //       // },
      //     ],
      //     as: 'product_info',
      //   },
      // },
      {
        $match: condition,
      },
      // {
      //   $unwind: '$user',
      // },
      // {
      //   $unwind: '$client',
      // },
      // {
      //   $unwind: '$shipping_method',
      // },
      {
        $addFields: {
          product_order_line: {
            $map: {
              input: '$product_order_line',
              as: 'pol',
              in: {
                $mergeObjects: [
                  '$$pol',
                  {
                    product_name: {
                      $let: {
                        vars: {
                          matchedProduct: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: '$product_info',
                                  as: 'pi',
                                  cond: { $eq: ['$$pi._id', '$$pol.product_id'] },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        // in: '$$matchedProduct.name',
                        in: {
                          $ifNull: ['$$matchedProduct.name', null],
                        },
                      },
                    },
                    contracts: {
                      $let: {
                        vars: {
                          matchedContract: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: '$product_info',
                                  as: 'pi',
                                  cond: { $eq: ['$$pi._id', '$$pol.product_id'] },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: {
                          $ifNull: ['$$matchedContract.contracts.name', null],
                        },
                        // in: '$$matchedContract.contracts.name',
                      },
                    },
                  },
                ],
              },
            },
          },
          // first_month_fee: '$$pol.first_month_fee',
          // product_id: '$$pol.product_id',
          user: {
            $cond: [{ $eq: [{ $size: '$user' }, 0] }, null, { $arrayElemAt: ['$user.name', 0] }],
          },

          client: {
            $cond: [{ $eq: [{ $size: '$client' }, 0] }, null, { $arrayElemAt: ['$client.name', 0] }],
          },
          shipping_method: {
            $cond: [{ $eq: [{ $size: '$shipping_method' }, 0] }, null, { $arrayElemAt: ['$shipping_method.name', 0] }],
          },
        },
      },
      {
        $project: {
          _id: 0,
          product_info: 0,
        },
      },
    ];
  }
  getPipelineOrderCount(condition: any): any[] {
    return [
      {
        $lookup: {
          from: 'clients',
          localField: 'client_id',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $match: condition,
      },
      {
        $count: 'count',
      },
    ];
  }

  async getClientOrder(client_id: string, getClientOrderDto: GetClientOrderDto): Promise<ResPagingDto<Order[]>> {
    const { sort, page, limit, order_id } = getClientOrderDto;
    // eslint-disable-next-line
    const query: any = {};
    query.client_id = client_id;

    if (order_id) {
      query._id = order_id;
    }

    const [result, total] = await Promise.all([
      this.orderModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.orderModel.find(query).countDocuments(),
    ]);
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }
  async getOrderById(id: string): Promise<any> {
    const pipeline = this.getPipelineOrder({
      _id: new mongoose.Types.ObjectId(id),
      deleted: false,
    });
    const order = await this.orderModel.aggregate(pipeline).exec();
    return {
      order: order,
    };
  }
  async getQuery(getOrderDto: any): Promise<any> {
    const {
      // sort,
      // sort_by,
      // page,
      // limit,
      user_id,
      client_name,
      client_phone_number,
      client_id,
      order_id,
      shipping_method_id,
      service_info_id,
      status,
      // source_ids,
      purchase_status,
      payment_method,
      from_date,
      to_date,
    } = getOrderDto;
    // eslint-disable-next-line
    const query: any = {};

    if (order_id) {
      query._id = new mongoose.Types.ObjectId(order_id);
    }
    // if (client_id && Array.isArray(client_id)) {
    //   const objectIds = client_id.map((id) => new mongoose.Types.ObjectId(id));
    //   query.client_id = { $in: objectIds };
    // }
    if (client_phone_number || client_name) {
      const client_query: any = {};
      if (client_phone_number) {
        const regex = new RegExp(client_phone_number);
        client_query.phone = { $regex: regex };
      }

      if (client_name) {
        const regex = new RegExp(client_name);
        client_query.name = { $regex: regex };
      }
      let clientIds = await this.clientModel.find(client_query).select('_id');
      clientIds = clientIds.map((e) => e._id);
      query.client_id = { $in: clientIds };
    }
    if (client_id) {
      query.client_id = new mongoose.Types.ObjectId(client_id);
    }

    if (shipping_method_id && Array.isArray(shipping_method_id)) {
      const objectIds = shipping_method_id.map((id) => new mongoose.Types.ObjectId(id));
      query.shipping_method_id = { $in: objectIds };
    }
    if (service_info_id && Array.isArray(service_info_id)) {
      const objectIds = service_info_id.map((id) => new mongoose.Types.ObjectId(id));
      query['product_order_line.product_id'] = { $in: objectIds };
    }

    if (purchase_status) {
      query.purchase_status = purchase_status;
    }

    if (payment_method) {
      query.payment_method = { $in: payment_method };
    }

    //
    if (user_id && Array.isArray(user_id)) {
      const objectIds = user_id.map((id) => new mongoose.Types.ObjectId(id));
      query.user_id = { $in: objectIds };
    }
    if (status) {
      query.status = { $in: status };
    }
    if (from_date && to_date) {
      query.createdAt = {
        $gte: from_date,
        $lte: to_date,
      };
    } else if (from_date) {
      query.createdAt = {
        $gte: from_date,
      };
    } else if (to_date) {
      query.createdAt = {
        $lte: to_date,
      };
    }
    // if (source_id) {
    //   query['client.source_id'] = new mongoose.Types.ObjectId(source_id);
    // }
    return query;
  }
  async find(getOrderDto: GetOrderDto): Promise<ResPagingDto<Order[]>> {
    const { sort, sort_by, page, limit } = getOrderDto;
    const query = this.getQuery(getOrderDto);
    let pipeline = this.getPipelineOrder(query);
    pipeline = pipeline.concat([
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);
    // eslint-disable-next-line
    let sortParam: any = {};
    if (sort_by) {
      sortParam[sort_by] = sort || -1;
    } else {
      sortParam.createdAt = sort || -1;
    }
    //
    pipeline.push({ $sort: sortParam });
    const pipelineCount = this.getPipelineOrderCount(query);
    const [result, count] = await Promise.all([
      this.orderModel.aggregate(pipeline).exec(),
      this.orderModel.aggregate(pipelineCount).exec(),
    ]);
    console.log(result);
    const total = count[0]?.count || 0;
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }
  async clientHistory(getOrderDto: any, client_id: string): Promise<ResPagingDto<Order[]>> {
    const { sort, sort_by, page, limit } = getOrderDto;
    getOrderDto.client_id = client_id;
    const query = this.getQuery(getOrderDto);
    let pipeline = this.getPipelineOrder({ client_id: new mongoose.Types.ObjectId('6520b82e71b37804a3d343fe') });
    pipeline = pipeline.concat([
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ]);
    // eslint-disable-next-line
    let sortParam: any = {};
    if (sort_by) {
      sortParam[sort_by] = sort || -1;
    } else {
      sortParam.createdAt = sort || -1;
    }
    //
    pipeline.push({ $sort: sortParam });

    const pipelineCount = this.getPipelineOrderCount(query);
    const [result, count] = await Promise.all([
      this.orderModel.aggregate(pipeline).exec(),
      this.orderModel.aggregate(pipelineCount).exec(),
    ]);
    const total = count[0]?.count || 0;
    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  // async clientCreateOrder(createOrderDto: CreateOrderDto, userId: string): Promise<void> {
  //   await this.orderModel.create(createOrderDto);
  // }
  // eslint-disable-next-line

  async exportFileExcel(param: GetOrderDto, res: Response): Promise<void> {
    const query = await this.getQuery(param);
    // const serviceInfos = await this.findServiceInfos(query, param);
    // const result = this.mapServicesInfo(serviceInfos);
    const pipeline = this.getPipelineOrder(query);

    const data = await this.orderModel.aggregate(pipeline).exec();

    // const mapService = result.map((_) => {
    //   if (_?.histories) {
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     const { histories, ...result } = _;
    //     return result;
    //   }
    //   return _;
    // });

    if (data.length > 0) {
      this.excelService.exportToExcel(data, res, 'service-info');
    } else {
      res.send();
    }
  }

  async adminCreateOrder(createOrderDto: CreateOrderDtoAdmin): Promise<void> {
    if (createOrderDto.client_id === null) {
      const client = await this.clientModel.create({
        ...createOrderDto.client,
        code: generateCustomerCode('KH_'),
        status: ClientStatus.ACTIVE,
      });
      createOrderDto.client_id = client._id;
    } else {
      const client = await this.clientModel.findOne({
        _id: createOrderDto.client_id,
        status: ClientStatus.ACTIVE,
        // deleted: false,
      });
      if (!client) throw new BadRequestException(httpErrors.CLIENT_NOT_FOUND_WHEN_ORDER);
    }
    console.log(createOrderDto);
    await this.orderModel.create({ ...createOrderDto });
  }
  async clientCreateOrder(createOrderDto: CreateOrderDtoClient, client_id: string): Promise<void> {
    const client = await this.clientModel.findOne({
      _id: client_id,
      status: ClientStatus.ACTIVE,
      deleted: false,
    });
    if (!client) throw new BadRequestException(httpErrors.CLIENT_NOT_FOUND_WHEN_ORDER);

    // map fee from service info
    const distinctProductIds = [...new Set(createOrderDto.product_order_line.map((item) => item.product_id))];

    const productData = await this.serviceInfoModel.find({
      _id: { $in: distinctProductIds },
    });

    createOrderDto.product_order_line.forEach((item: any) => {
      const product = productData.find((product) => product._id.equals(item.product_id));
      if (product) {
        item.monthly_fee = product?.selling_fee?.price;
      }
    });

    await this.orderModel.create({ ...createOrderDto, client_id: client_id });
  }

  // async createPromotion(promotionalDto: CreatePromotionDto): Promise<void> {
  //   await this.orderModel.create(promotionalDto);
  // }

  // async updatePromotion(_id: string, updatePromotionDto: UpdatePromotionDto): Promise<void> {
  //   const promotion = await this.orderModel.findOne({ _id });
  //   if (!promotion) {
  //     throw new BadRequestException(httpErrors.PROMOTION_NOT_FOUND);
  //   }
  //   await this.orderModel.findOneAndUpdate({ _id }, updatePromotionDto);
  // }

  async deleteById(_id: string, delete_by: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate({ _id }, { deleted: true, delete_by });
  }

  async deleteByAdmin(_id: string, delete_by: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate({ _id }, { deleted: true, delete_by });
  }

  async addOrderLineById(_id: string, orderLine: AddOrderLine, userId: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate(
      { _id },
      { $push: { product_order_line: orderLine.product_order_line }, update_by: userId },
      { new: true },
    );
  }

  async updateById(_id: string, dto: updateOrderDto, userId: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    // const updateQuery: any = {};
    if (dto.product_order_line) dto['$push'] = { product_order_line: dto.product_order_line };
    delete dto.product_order_line;
    await this.orderModel.findOneAndUpdate({ _id }, { ...dto, update_by: userId }, { new: true });
  }

  async updateShippingInfoById(_id: string, dto: updateShippingInfoDto, userId: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (dto.product_shipping_map) {
        await Promise.all(
          dto.product_shipping_map.map(async (e) => {
            const updatedData = await this.productModel.findOneAndUpdate(
              {
                $or: [{ product_info_id: e.product_id }, { service_info_id: e.product_id }],
                iccid: e.iccid,
                imei: e.imei,
              },
              { order_id: _id, status: ProductStatusEnum.SOLD },
              { session, new: true },
            );
            if (!updatedData) {
              throw new BadRequestException(
                `not found product with iccid: ${e.iccid} and imei: ${e.imei} and product)_info_id(or service_info_id)`,
              );
            }
          }),
        );
      }
      delete dto.product_shipping_map;
      await this.orderModel.findOneAndUpdate({ _id }, { ...dto, update_by: userId }, { session, new: true });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException(error);
    } finally {
      session.endSession();
    }
  }

  async changeStatusById(_id: string, dto: ChangeStatus, userId: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate({ _id }, { status: dto.status, update_by: userId }, { new: true });
  }
  async changeStatus(dto: ChangeBulkStatus, userId: string): Promise<void> {
    const orderCount = await this.orderModel.find({ _id: { $in: dto.order_id } }).countDocuments();
    console.log(orderCount);
    if (orderCount !== dto.order_id.length) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.updateMany(
      { _id: { $in: dto.order_id } },
      { status: dto.status, update_by: userId },
      { new: true },
    );
  }
  async cancelOrder(_id: string, dto: CancelOrder, userId: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate(
      { _id },
      { ...dto, status: OrderStatus.CANCELED, update_by: userId },
      { new: true },
    );
  }

  async reconfirmOrder(_id: string, dto: ReconfirmOrder, userId: string): Promise<void> {
    const order = await this.orderModel.findById(_id);
    if (!order) {
      throw new BadRequestException(httpErrors.ORDER_NOT_FOUND);
    }
    await this.orderModel.findOneAndUpdate(
      { _id },
      { ...dto, status: OrderStatus.NEED_RECONFIRMATION, update_by: userId },
      { new: true },
    );
  }
  async importFileExcel(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelOrder.importOrderServiceExcel(file, res, userId);
  }
}
