import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import mongoose, { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { httpErrors } from 'src/shares/exceptions';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { PaginationDto, ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { ProductInfo, ProductInfoDocument } from '../product-info/schemas/product-info.schema';
import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema';
import { sortHistories } from 'src/shares/helpers/utils';
import { ServiceInfoService } from '../service-info/service-info.service';
import { ProductInfoService } from '../product-info/product-info.service';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { ProductStatusEnum, ProductTypeEnum } from 'src/shares/enums/product.enum';
import { Response } from 'express';
import { ExcelService } from '../excel/excel.service';
import { ExcelProductServiceTelecomService } from '../excel/excel-product-service-telecom.service';
import { ExcelProductServiceService } from '../excel/excel-product-service.service';
import { ExcelProductService } from '../excel/excel-product.service';
import { MapProductDto } from './dto/map-product.dto';
// import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { Client, ClientDocument } from '../client/schemas/client.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>,
    @InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    // @InjectModel(Group.name) private GroupModel: Model<GroupDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,

    private serviceInfoService: ServiceInfoService,
    private productInfoService: ProductInfoService,
    private excelService: ExcelService,
    private excelProductServiceTelecomService: ExcelProductServiceTelecomService,
    private excelProductServiceService: ExcelProductServiceService,
    private excelProductService: ExcelProductService,
  ) { }

  async getInfoProductSuggestById(id: string): Promise<any> {
    const pipeline = this.getPipelineProductHome({
      delete: false,
      _id: id,
    });
    const productInfo = await this.productInfoModel.aggregate(pipeline).exec();
    console.log(pipeline);
    const { _id, name, image_url, discount_price, currency_unit, default_selling_price, desc } = productInfo[0];

    return {
      _id,
      name,
      image_url,
      default_selling_price: default_selling_price?.toString(),
      discount_price: discount_price?.toString(),
      currency_unit_name: currency_unit?.name,
      currency_unit_id: currency_unit?._id,
      currency_unit_symbol: currency_unit?.symbol,
      currency_unit_position: currency_unit?.position,
      desc,
    };
  }

  async findAndCountSold(param: GetProductDto): Promise<ResPagingDto<any[]>> {
    const { limit, page } = param;

    const pipeline = this.getPipelineProductHome({ delete: false });
    const pipelineCount = this.getCountPipeline();
    // const pipelineCount = this.getPipelineCount;
    console.log(pipeline);
    const [products, countProduct] = await Promise.all([
      this.productInfoModel
        .aggregate(pipeline)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.productInfoModel.aggregate(pipelineCount).exec(),
    ]);

    const total = countProduct[0]?.total || 0;
    const result = products.map((product) => {
      const { _id, name, quantity_sold, image_url, default_selling_price, discount_price, currency_unit } = product;
      return {
        _id,
        name,
        quantity_sold,
        image_url,
        default_selling_price: default_selling_price?.toString(),
        discount_price: discount_price?.toString(),
        currency_unit_name: currency_unit?.name,
        currency_unit_position: currency_unit?.position,
        currency_unit_symbol: currency_unit?.symbol,
      };
    });

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  getCountPipeline(): any {
    return [
      {
        $match: { deleted: false },
      },
      {
        $unionWith: {
          coll: 'service_infos',
          pipeline: [
            {
              $match: { deleted: false },
            },
          ],
        },
      },
      {
        $count: 'total',
      },
    ];
  }

  getPipelineProductHome(condition: any): any[] {
    return [
      {
        $match: condition,
      },
      {
        $unionWith: {
          coll: 'service_infos',
          pipeline: [
            {
              $match: { deleted: false },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'units',
          localField: 'currency_unit_id',
          foreignField: '_id',
          as: 'currency_unit',
        },
      },
      {
        $unwind: {
          path: '$currency_unit',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'product_info_id',
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$status', ProductStatusEnum.SOLD] },
              },
            },
          ],
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'service_info_id',
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$status', ProductStatusEnum.SOLD] },
              },
            },
          ],
          as: 'products',
        },
      },
      {
        $project: {
          product: 1,
          _id: 1,
          name: 1,
          quantity_sold: { $size: '$products' },
        },
      },
      {
        $sort: { quantity_sold: -1 },
      },
    ];
  }

  getPipelineProduct(param: GetProductDto): any[] {
    const { page, limit } = param;

    return [
      {
        $group: {
          _id: {
            $cond: {
              if: { $ne: ['$service_info_id', null] },
              then: '$service_info_id',
              else: '$product_info_id',
            },
          },
          quantity_sold: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'service_infos',
          localField: '_id',
          foreignField: '_id',
          as: 'service_infos',
        },
      },
      {
        $lookup: {
          from: 'product_infos',
          localField: '_id',
          foreignField: '_id',
          as: 'product_infos',
        },
      },
      {
        $unwind: { path: '$service_info', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$product_info', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          quantity_sold: 1,
          type_product: {
            $cond: {
              if: { $ne: ['$_id', null] },
              then: 0,
              else: 1,
            },
          },
          info: {
            $cond: {
              if: { $ne: ['$service_infos', null] },
              then: '$service_infos',
              else: '$product_infos',
            },
          },
        },
      },
      {
        $sort: { quantity_sold: -1 },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];
  }

  async exportFileExcel(param: GetProductDto, res: Response): Promise<void> {
    const query = await this.buildQuery(param);
    const products = await this.findProduct(query, param);
    const result = this.mapProduct(products);

    const mapService = result.map((_) => {
      if (_?.histories) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { histories, ...result } = _;
        return result;
      }
      return _;
    });

    this.excelService.exportToExcel(mapService, res, 'product');
  }

  async findProductById(id: string): Promise<MapProductDto> {
    const populateServiceInfo = this.serviceInfoService.getPopulateServiceInfo();
    const populateProductInfo = this.productInfoService.getPopulateProductInfo();
    const populateProduct = this.getPopulateProduct(populateProductInfo, populateServiceInfo);
    const product = await this.productModel.findById(id).populate(populateProduct);

    if (product) {
      const result = this.mapProduct([product]);
      return result[0];
    }

    return;
  }

  async importExcelServiceTelecom(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelProductServiceTelecomService.importProductServiceTelecomExcel(file, res, userId);
  }

  async importExcelService(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelProductServiceService.importProductServiceExcel(file, res, userId);
  }

  async importExcelProduct(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelProductService.importProductExcel(file, res, userId);
  }

  async find(param: GetProductDto): Promise<ResPagingDto<MapProductDto[]>> {
    // search product info and service info
    const pipeline = this.buildAggregateProductInfo(param);
    const info_product = await this.productInfoModel.aggregate(pipeline);
    const productInfosIds = info_product.map((_) => {
      return _._id.toString();
    });

    // get product
    const query = await this.buildQuery(param, productInfosIds);
    const [result, total] = await Promise.all([this.findProduct(query, param), this.countProduct(query)]);
    const productInfo = this.mapProduct(result);
    return {
      result: productInfo,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  // get product info and service info
  async findProductInfo(param: GetProductDto): Promise<ResPagingDto<MapProductDto[]>> {
    const pipeline = this.buildAggregateProductInfo(param);

    // sort param
    const sortParam = {};
    if (param.sort_field) {
      sortParam[param.sort_field] = param.sort;
    } else {
      sortParam['createdAt'] = param.sort;
    }

    const pipelinePaging = [
      ...pipeline,
      {
        $sort: sortParam,
      },
      {
        $skip: (param.page - 1) * param.limit,
      },
      {
        $limit: param.limit,
      },
    ];

    const pipelineCount = [...pipeline, { $group: { _id: null, count: { $sum: 1 } } }];

    // get product info and service info
    const [result, total] = await Promise.all([
      this.productInfoModel.aggregate(pipelinePaging),
      this.productInfoModel.aggregate(pipelineCount).exec(),
    ]);

    const data = this.mapProductInfo(result);

    return {
      result: data,
      total: total[0]?.count,
      lastPage: Math.ceil(total[0]?.count / param.limit),
    };
  }

  async findProductInfoById(id: string): Promise<any> {
    const pipeline = this.buildAggregateProductInfo({ id });

    const result = await this.productInfoModel.aggregate(pipeline).exec();

    return this.mapProductInfo(result)[0];
  }

  buildAggregateProductInfo(param: GetProductDto): any {
    const { type_id, name, group_key, id } = param;
    let condition: any = {};

    condition.deleted = false;

    if (id) {
      condition._id = new mongoose.Types.ObjectId(id);
    }

    // if (id) {
    //   condition._id = new mongoose.Types.ObjectId(id);
    // }
    // if (id) {
    //   condition._id = new mongoose.Types.ObjectId(id);
    // }

    if (name) {
      condition.name = { $regex: name, $options: 'i' };
    }
    const conditionServiceInfo = condition;

    // search type
    if (type_id) {
      condition.$or = [
        { type_service_id: new mongoose.Types.ObjectId(type_id) },
        { product_type_id: new mongoose.Types.ObjectId(type_id) },
      ];
    }

    let pipelineGroup = [];

    // search group
    if (group_key) {
      condition = {
        $and: [condition, { group_exit: true }],
      };

      pipelineGroup = [
        {
          $match: {
            key: group_key,
          },
        },
      ];
    }

    return [
      {
        $unionWith: {
          coll: 'service_infos',
          pipeline: [
            {
              $match: conditionServiceInfo,
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'group',
          localField: 'group_id',
          foreignField: '_id',
          as: 'product_group',
          pipeline: pipelineGroup,
        },
      },
      {
        $lookup: {
          from: 'group',
          localField: 'service_group_id',
          foreignField: '_id',
          as: 'service_group',
          pipeline: pipelineGroup,
        },
      },
      {
        $lookup: {
          from: 'units',
          localField: 'unit_id',
          foreignField: '_id',
          as: 'units',
        },
      },
      {
        $lookup: {
          from: 'units',
          localField: 'currency_unit_id',
          foreignField: '_id',
          as: 'currency',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'product_info_id',
          // count all status sold ,use (re-define  status enum)
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$status', ProductStatusEnum.SOLD] },
              },
            },
          ],
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'service_info_id',
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$status', ProductStatusEnum.SOLD] },
              },
            },
          ],
          as: 'product_services',
        },
      },
      {
        $addFields: {
          quantity_sold_product: { $size: '$products' },
          quantity_sold_service: { $size: '$product_services' },
        },
      },
      {
        $addFields: {
          quantity_sold: { $add: ['$quantity_sold_product', '$quantity_sold_service'] },
        },
      },
      {
        $addFields: {
          group_exit: {
            $or: [{ $gt: [{ $size: '$product_group' }, 0] }, { $gt: [{ $size: '$service_group' }, 0] }],
          },
        },
      },
      {
        $match: condition,
      },
    ];
  }

  async countProduct(query: any): Promise<number> {
    return this.productModel.find(query).countDocuments();
  }

  async findProduct(query: any, param: PaginationDto): Promise<any[]> {
    const populateServiceInfo = this.serviceInfoService.getPopulateServiceInfo();
    const populateProductInfo = this.productInfoService.getPopulateProductInfo();
    const populateProduct = this.getPopulateProduct(populateProductInfo, populateServiceInfo);

    return this.productModel
      .find(query)
      .populate(populateProduct)
      .skip((param.page - 1) * param.limit)
      .limit(param.limit)
      .sort({ createdAt: param.sort });
  }

  getPopulateProduct(populateProductInfo: any, populateServiceInfo: any): any {
    console.log(populateServiceInfo);
    return [
      {
        path: 'order_id',
        model: this.orderModel,
        select: '-__v -createdAt -updatedAt -deleted',
        populate: [
          {
            path: 'client_id',
            model: this.clientModel,
            // match: { deleted: false },
            select: 'name email',
          },
        ],
      },
      {
        path: 'supplier_id',
        model: this.supplierModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'product_info_id',
        model: this.productInfoModel,
        select: '-__v  -deleted ',
        populate: populateProductInfo,
      },
      {
        path: 'service_info_id',
        model: this.serviceInfoModel,
        select: '-__v  -deleted ',
        populate: populateServiceInfo,
      },
      {
        path: 'buying_fee',
        populate: { path: 'unit_id', model: this.unitModel, select: '-__v  -deleted' },
      },
      {
        path: 'unit_id',
        model: this.unitModel,
        select: '-__v  -deleted',
      },
    ];
  }

  private async buildQuery(param: GetProductDto, idProductInfos?: string[]): Promise<any> {
    const { id, code, type, type_id, client_id } = param;
    const query: any = {};
    query.deleted = false;

    if (type) {
      if (type === ProductTypeEnum.PRODUCT) query.product_info_id = { $ne: null };
      if (type === ProductTypeEnum.SERVICE) query.service_info_id = { $ne: null };
    }

    if (code) {
      query.code = code;
    }

    if (id) {
      query._id = id;
    }
    if (client_id) {
      let orderId = await this.orderModel.find({ client_id: client_id, deleted: false }).select('_id');
      orderId = orderId.map((e) => e._id);
      query['order_id'] = { $in: orderId };
    }

    if (type_id) {
      query.$or = [{ product_info_id: type_id }, { service_info_id: type_id }];
    }

    if (idProductInfos) {
      query.$or = query.$or || [];

      query.$or.push({ product_info_id: { $in: idProductInfos } });

      query.$or.push({ service_info_id: { $in: idProductInfos } });
    }

    return query;
  }

  mapProduct(products: Product[]): MapProductDto[] {
    return products.map((product: any) => {
      const serviceInfo = product?.service_info_id;
      const productInfo = product?.product_info_id;
      const unit = product?.unit_id;

      return {
        _id: product?.id,
        ID: product?.ID,
        group_id: serviceInfo?.service_group_id?._id || productInfo?.group_id?._id,
        status: product?.status,
        name: product?.name,
        code: product?.code,
        deleted: product?.deleted,
        desc: product?.desc,
        currency: product?.currency,
        createdAt: product?.createdAt,
        supplier_id: product?.supplier_id?._id,
        supplier_name: product?.supplier_id?.name,
        product_info: productInfo ? this.productInfoService.mapProductInfo([productInfo])[0] : undefined,
        service_info: serviceInfo ? this.serviceInfoService.mapServicesInfo([serviceInfo])[0] : undefined,
        histories: sortHistories(product?.histories || []),
        imei: product?.imei,
        iccid: product?.iccid,
        import_date: product?.import_date,
        contract_expire_date: product?.contract_expire_date,
        active_date: product?.active_date,
        inactive_date: product?.inactive_date,
        saihakko_fee: product?.saihakko_fee?.toString(),
        producer: product?.producer_id,
        unit_name: unit?.name,
        unit_id: unit?.id,
        order_id: product?.order_id || null,
      };
    });
  }
  // mapOrderInfo(orders: any[]): any[] {
  //   return orders.map((e: any) => {
  //     return {
  //       _id: e?.id,
  //       product_type_id: productInfo?.product_type_id?._id,
  //       product_type_name: productInfo?.product_type_id?.name,
  //       status: productInfo?.status,
  //       name: productInfo?.name,
  //       code: productInfo?.code,
  //       group_name: productInfo?.group_id?.name,
  //       group_id: productInfo?.group_id?._id,
  //       type_product_use_id: productInfo?.type_product_use_id?._id,
  //       type_product_use_name: productInfo?.type_product_use_id?.name,
  //       currency_unit_id: productInfo?.currency_unit_id?._id,
  //       currency_unit_name: productInfo?.currency_unit_id?.name,
  //       currency_unit_symbol: productInfo?.currency_unit_id?.symbol,
  //       unit_id: productInfo?.unit_id?._id,
  //       unit_name: productInfo?.unit_id?.name,
  //       producer_info: {
  //         producer_id: productInfo?.producer_info?.producer_id?._id,
  //         producer_name: productInfo?.producer_info?.producer_id?.name,
  //         product_production_location: productInfo?.producer_info?.product_production_location,
  //       },
  //       attribute: productInfo.attribute,
  //       selling_exchanges: productInfo?.selling_exchanges?.map((_: any) => {
  //         return {
  //           price: _?.price?.toString(),
  //           unit_id: _?.unit_id?._id?.toString(),
  //           unit_name: _?.unit_id?.name,
  //           exchange_type: _?.exchange_type,
  //           quantity: _?.quantity,
  //         };
  //       }),
  //       default_selling_price: productInfo?.default_selling_price?.toString(),
  //       discount_price: productInfo?.discount_price.toString(),
  //       histories: sortHistories(productInfo?.histories || []),
  //       deleted: productInfo?.deleted,
  //       image_url: productInfo?.image_url,
  //       desc: productInfo?.desc,
  //       createdAt: productInfo?.createdAt,
  //       attributes: productInfo?.attributes,
  //     };
  //   });
  // }

  mapProductInfo(productInfos: any[]): any[] {
    return productInfos.map((info: any) => {
      const currency = info?.currency?.[0];
      const producer_id = info?.producer_info;
      const group = info.product_group?.[0] || info.service_group?.[0];
      const quantity_sold = info?.quantity_sold;
      const default_selling_price = info?.default_selling_price?.toString();
      const discount_price = info?.discount_price?.toString();

      return {
        group_exit: info?.group_exit,
        _id: info?._id,
        group_id: info?.service_group_id?._id || info?.group_id?._id,
        group: group,
        status: info?.status,
        name: info?.name,
        code: info?.code,
        deleted: info?.deleted,
        desc: info?.desc,
        currency,
        image_url: info.image_url,
        producer_info: {
          producer_id: producer_id?.producer_id,
          production_location: producer_id?.service_production_location || producer_id?.product_production_location,
        },
        attributes: info.attributes,
        quantity_sold,
        default_selling_price,
        discount_price,
        type_id: info?.product_type_id || info?.type_service_id,
      };
    });
  }

  async updateProduct(id: string, payload: UpdateProductDto, update_by: string): Promise<void> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND);
    }

    payload['histories'] = [
      ...(product?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    await this.productModel.findOneAndUpdate({ _id: id }, payload);
  }

  async createProduct(payload: CreateProductDto, create_by: string): Promise<void> {
    await this.productModel.create({
      ...payload,
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async deleteProducts(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const serviceInfo = await this.productModel.findById(id);

        if (!serviceInfo) {
          throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND);
        }

        const histories = [...(serviceInfo?.histories || []), { delete_by, created_at: new Date() }];

        await this.productModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }
}
