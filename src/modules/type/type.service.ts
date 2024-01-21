import { InjectModel } from '@nestjs/mongoose';
import { Type, TypeDocument } from './schemas/type.schema';
import { Model } from 'mongoose';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { httpErrors } from 'src/shares/exceptions';
import { GetTypeDto } from './dto/get-type.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { sortHistories } from 'src/shares/helpers/utils';
import { ServiceInfoService } from '../service-info/service-info.service';
import { MapServiceInfoDto } from '../service-info/dto/res-map-service-info.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';
import { MapProductInfoDto } from '../product-info/dto/map-product-info.dto';
import { Response } from 'express';
import { ExcelService } from '../excel/excel.service';

import { ProductInfoService } from '../product-info/product-info.service';
import { Group, GroupDocument } from '../group/schemas/group.schema';

@Injectable()
export class TypeService {
  constructor(
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,

    private serviceInfoService: ServiceInfoService,
    private productInfoService: ProductInfoService,
    private excelService: ExcelService,
  ) {}

  async exportFileExcel(param: GetTypeDto, res: Response): Promise<void> {
    const query = await this.buildQuery(param);
    const types = await this.findType(query, param);
    let typeInfo;

    if (param.type == TypeTypeEnum.product) {
      typeInfo = await this.getProductOfProductInfoByType(types, param);
    } else {
      typeInfo = await this.getProductOfServiceInfoByType(types, param);
    }
    let productInfo: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    typeInfo = typeInfo.map((_) => {
      productInfo = [...productInfo, ..._?.products];
    });

    if (productInfo.length > 0) {
      this.excelService.exportToExcel(productInfo, res, 'product');
    } else {
      res.send();
    }
  }

  async find(param: GetTypeDto): Promise<ResPagingDto<any[]>> {
    const query = await this.buildQuery(param);
    const [types, total] = await Promise.all([this.findType(query, param), this.countTypes(query)]);

    return {
      result: types,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async findTypeAndServiceInfo(param: GetTypeDto): Promise<ResPagingDto<any[]>> {
    const query = await this.buildQuery(param);
    const [types, total] = await Promise.all([this.findType(query, param), this.countTypes(query)]);

    const serviceInfos = await Promise.all(
      types.map(async (type: any) => {
        const queryServiceInfo = await this.serviceInfoService.buildQuery(param);
        queryServiceInfo.type_service_id = type['id'];
        const { limit, page } = this.getPageAndLimitById(param, type['id']);

        // get service info
        const serviceInfos = await this.serviceInfoService.findServiceInfos(queryServiceInfo, {
          sort: -1,
          limit,
          page,
        });

        const mapServiceInfos = this.serviceInfoService.mapServicesInfo(serviceInfos);

        return {
          type_id: type._id,
          type_name: type.name,
          service_infos: mapServiceInfos,
          total,
          lastPage: Math.ceil(total / param.limit),
        };
      }),
    );

    return {
      result: serviceInfos,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async findTypeAndProductInfo(param: GetTypeDto): Promise<ResPagingDto<any[]>> {
    const query = await this.buildQuery(param);
    const [types, total] = await Promise.all([this.findType(query, param), this.countTypes(query)]);

    const productInfos = await Promise.all(
      types.map(async (type: any) => {
        const queryProductInfo = await this.buildQueryProductInfo(type.id, param);
        queryProductInfo.product_type_id = type['id'];
        const { limit, page } = this.getPageAndLimitById(param, type['id']);

        // get product info
        const productInfos = await this.productInfoService.findProductInfos(queryProductInfo, {
          sort: -1,
          limit,
          page,
        });
        const mapProductInfos = this.productInfoService.mapProductInfo(productInfos);

        return {
          type_id: type._id,
          type_name: type.name,
          product_infos: mapProductInfos,
          total,
          lastPage: Math.ceil(total / param.limit),
        };
      }),
    );

    return {
      result: productInfos,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async findTypeProduct(param: GetTypeDto): Promise<ResPagingDto<any[]>> {
    let groupIds = [];
    if (param.group_key) {
      const group = await this.groupModel.find({ key: param.group_key });
      groupIds = group.map((_) => {
        return _._id.toString();
      });
    }

    const query = await this.buildQuery(param, groupIds);
    const [types, total] = await Promise.all([this.findType(query, param), this.countTypes(query)]);
    let typeInfo;

    // get type product info
    if (param.type == TypeTypeEnum.product) {
      typeInfo = await this.getProductOfProductInfoByType(types, param);
    } else {
      // get service info
      typeInfo = await this.getProductOfServiceInfoByType(types, param);
    }

    return {
      result: typeInfo,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async getType(param: GetTypeDto): Promise<ResPagingDto<any[]>> {
    const { page, limit, group_key } = param;

    const condition: any = {};
    if (group_key) {
      condition['group.key'] = group_key;
    }

    const aggregatePipeline: any[] = [
      {
        $lookup: {
          from: 'products',
          let: { typeId: '$_id' },
          pipeline: [
            {
              $lookup: {
                from: 'service_infos',
                localField: 'service_info_id',
                foreignField: '_id',
                as: 'service_infos',
              },
            },
            {
              $lookup: {
                from: 'product_infos',
                localField: 'product_info_id',
                foreignField: '_id',
                as: 'product_infos',
              },
            },
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $in: ['$$typeId', { $ifNull: ['$product_infos.product_type_id', []] }],
                    },
                    {
                      $in: ['$$typeId', { $ifNull: ['$service_infos.type_service_id', []] }],
                    },
                  ],
                },
              },
            },
          ],
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'group',
          localField: 'group_id',
          foreignField: '_id',
          as: 'group',
        },
      },
      {
        $match: condition,
      },
      {
        $addFields: {
          quantity_sold: { $size: '$products' },
        },
      },
      {
        $project: {
          products: 0,
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

    const aggregatePipelineWithFacet = [
      {
        $facet: {
          data: [...aggregatePipeline],

          total: [
            {
              $count: 'total',
            },
          ],
        },
      },
    ];

    const result = await this.typeModel.aggregate(aggregatePipelineWithFacet).exec();

    const data = result[0]?.data;
    const total = result[0]?.total[0]?.total;

    return {
      result: data,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getProductOfProductInfoByType(types: Type[], param: GetTypeDto): Promise<any[]> {
    return Promise.all(
      types.map(async (type: any) => {
        const queryProductInfo = this.buildQueryProductInfo(type.id, param);

        // get product info
        const productInfos = await this.productInfoService.findProductInfos(queryProductInfo, { sort: -1 });
        const productInfoIds = productInfos.map((_: any) => _.id);
        const mapProductInfos = this.productInfoService.mapProductInfo(productInfos);

        // get product
        const { result, total, lastPage } = await this.findProductByProductInfoIds(productInfoIds, param, type);

        // format product
        const mapProduct = this.formatProductProductInfo(mapProductInfos, result, type);

        return {
          type_name: type.name,
          type_id: type._id,
          products: mapProduct,
          total,
          lastPage,
        };
      }),
    );
  }

  async getProductOfServiceInfoByType(types: Type[], param: GetTypeDto): Promise<any[]> {
    return Promise.all(
      types.map(async (type: any) => {
        const queryServiceInfo = this.buildQueryServiceInfo(type.id, param);

        // get service info
        const serviceInfos = await this.serviceInfoService.findServiceInfos(queryServiceInfo, { sort: -1 });
        const serviceIds = serviceInfos.map((_: any) => _.id);
        const mapServiceInfos = this.serviceInfoService.mapServicesInfo(serviceInfos);

        // get product
        const { result, total, lastPage } = await this.findProductByServiceInfoIds(serviceIds, param, type);

        // format product
        const mapProduct = this.formatProductsServiceInfo(mapServiceInfos, result, type);

        return {
          type_name: type.name,
          type_id: type._id,
          products: mapProduct,
          total,
          lastPage,
        };
      }),
    );
  }

  formatProductProductInfo(mapProductInfos: MapProductInfoDto[], products: Product[], type: Type): any[] {
    const result = [];
    for (const p of products) {
      const p_info = mapProductInfos.find((_) => {
        if (_._id === p['product_info_id']?.toString()) {
          return _;
        }
      });

      if (!p_info) {
        continue;
      }

      const unit: any = p?.unit_id;
      const unitBuyingFee: any = p?.buying_fee?.unit_id;
      const currency_unit: any = p?.currency_unit_id;
      result.push({
        type_id: type['_id'],
        type_name: type?.name,
        name: p_info?.name,
        id: p['_id'],
        imei: p?.imei,
        iccid: p?.iccid,
        code: p?.code,
        producer_name: p_info?.producer_info?.producer_name,
        producer_id: p_info?.producer_info?.producer_id,
        product_info_name: p_info?.name,
        product_info_id: p_info?._id,
        group_name: p_info?.group_name,
        group_id: p_info?.group_id,
        import_date: p?.import_date,
        contract_expire_date: p?.contract_expire_date,
        saihakko_fee: p?.saihakko_fee?.toString(),
        selling_exchanges: p_info?.selling_exchanges?.map((_) => {
          return {
            price: _?.price,
            unit_id: _?.unit_id,
            unit_name: _?.unit_name,
            exchange_type: _?.exchange_type,
            quantity: _?.quantity,
          };
        }),
        active_date: p?.active_date,
        status: p?.status,
        inactive_date: p?.inactive_date,
        desc: p?.desc,
        producer: p_info?.producer_info,
        supplier: p?.supplier_id,
        attributes: p_info?.attributes,
        buying_price: p?.buying_price?.toString(),
        unit_name: unit?.name,
        unit_id: unit?.id,
        currency_unit_id: currency_unit?.id,
        currency_unit_name: currency_unit?.name,
        histories: sortHistories(p?.histories || []),
        image_url: p_info?.image_url,
        ID: p?.ID,
        buying_fee: {
          price: p?.buying_fee?.price?.toString(),
          unit_id: unitBuyingFee?._id,
          unit_name: unitBuyingFee?.name,
        },
        buying_info: {
          deposit: p.buying_info?.deposit.toString(),
          total: p.buying_info?.total.toString(),
        },
      });
    }

    return result;
  }

  async findProductByProductInfoIds(
    productInfoIds: string[],
    param: GetTypeDto,
    type: Type,
  ): Promise<{ result: Product[]; total: number; lastPage: number }> {
    const { limit, page } = this.getPageAndLimitById(param, type['id']);

    let query: any = {};
    query.product_info_id = { $in: productInfoIds };
    query = this.buildQueryProduct(query, param);

    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .populate([
          { path: 'buying_fee', populate: [{ path: 'unit_id', model: this.unitModel }] },
          { path: 'unit_id', model: this.unitModel },
          { path: 'currency_unit_id', model: this.unitModel },
          { path: 'supplier_id', model: this.supplierModel },
          {
            path: 'histories',
            populate: [
              { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
              { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
              { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
            ],
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 1 }),
      this.productModel.find(query).countDocuments(),
    ]);

    return {
      result: products,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  buildQueryProduct(query: any, param: GetTypeDto): any {
    const {
      product_unit_id,
      product_currency_unit_id,
      supplier_id,
      saihakko_fee_from,
      saihakko_fee_to,
      product_imei,
      product_iccid,
      product_code,
      product_import_date,
      product_contract_expire_date,
      product_buying_price,
      product_status,
      product_id,
      product_ID,
    } = param;
    const query_: any = {};

    query_.deleted = false;

    if (product_ID) {
      query_.ID = product_ID;
    }

    if (product_id) {
      query_._id = product_id;
    }

    if (product_status) {
      query_.status = product_status;
    }

    if (product_buying_price) {
      query_.buying_price = product_buying_price;
    }

    if (product_contract_expire_date) {
      query_.contract_expire_date = product_contract_expire_date;
    }

    if (product_import_date) {
      query_.import_date = product_import_date;
    }

    if (product_code) {
      query_.code = { $regex: product_code, $options: 'i' };
    }

    if (product_iccid) {
      query_.iccid = { $regex: product_iccid, $options: 'i' };
    }

    if (product_imei) {
      query_.imei = { $regex: product_imei, $options: 'i' };
    }

    if (product_unit_id) {
      query_.unit_id = product_unit_id;
    }

    if (product_currency_unit_id) {
      query_.currency_unit_id = product_currency_unit_id;
    }

    if (supplier_id) {
      query_.supplier_id = supplier_id;
    }

    if (saihakko_fee_to && saihakko_fee_from) {
      query_.saihakko_fee = { $gte: saihakko_fee_from, $lte: saihakko_fee_to };
    } else if (saihakko_fee_to) {
      query_.saihakko_fee = { $lte: saihakko_fee_to };
    } else if (saihakko_fee_from) {
      query_.saihakko_fee = { $gte: saihakko_fee_from };
    }
    return { ...query, ...query_ };
  }

  buildQueryProductInfo(typeId: string, param: GetTypeDto): any {
    const { product_group_id, producer_id, product_name } = param;
    const query: any = { deleted: false };

    if (product_name) {
      query.name = { $regex: product_name, $options: 'i' };
    }

    if (typeId) {
      query.product_type_id = typeId;
    }

    if (product_group_id) {
      query.group_id = product_group_id;
    }

    if (producer_id) {
      query.producer_info.producer_id = producer_id;
    }

    return query;
  }

  formatProductsServiceInfo(mapServiceInfos: MapServiceInfoDto[], products: Product[], type: Type): any[] {
    const result = [];
    for (const p of products) {
      const s = mapServiceInfos.find((_) => {
        if (_._id === p['service_info_id']?.toString()) {
          return _;
        }
      });

      if (!s) {
        continue;
      }

      const unit: any = p?.unit_id;
      const unitBuyingFee: any = p?.buying_fee?.unit_id;
      const currency_unit: any = p?.currency_unit_id;

      result.push({
        type_id: type['id'],
        type_name: type?.name,
        name: s?.name,
        id: p['_id'],
        imei: p?.imei,
        iccid: p?.iccid,
        code: p?.code,
        producer_name: s?.producer_name,
        producer_id: s?.producer_id,
        service_info_name: s?.name,
        service_info_id: s?._id,
        buy_type: s?.buy_type,
        group_name: s?.service_group_name,
        group_id: s?.service_group_id,
        capacity_name: s?.capacity_name,
        capacity_id: s?.capacity_id,
        contract_id: s?.contract_id,
        contract_name: s?.contract_name,
        import_date: p?.import_date,
        contract_expire_date: p?.contract_expire_date,
        selling_info: {
          deposit: s?.selling_info?.deposit,
          total: s?.selling_info?.total,
        },
        saihakko_fee: p?.saihakko_fee?.toString(),
        selling_fee: {
          unit_name: s?.selling_fee?.unit_name,
          unit_id: s?.selling_fee?.unit_id,
          price: s?.selling_fee?.price,
        },
        active_date: p?.active_date,
        status: p?.status,
        inactive_date: p?.inactive_date,
        desc: p?.desc,
        producer: s?.producer_info.producer,
        supplier: p?.supplier_id,
        attributes: s?.attributes,
        buying_price: p?.buying_price?.toString(),
        unit_name: unit?.name,
        unit_id: unit?.id,
        currency_unit_id: currency_unit?.id,
        currency_unit_name: currency_unit?.name,
        histories: sortHistories(p?.histories || []),
        image_url: s?.image_url,
        ID: p?.ID,
        buying_fee: {
          price: p?.buying_fee?.price?.toString(),
          unit_id: unitBuyingFee?._id,
          unit_name: unitBuyingFee?.name,
        },
        buying_info: {
          deposit: p.buying_info?.deposit.toString(),
          total: p.buying_info?.total.toString(),
        },
      });
    }

    return result;
  }

  buildQueryServiceInfo(typeId: string, param: GetTypeDto): any {
    const {
      product_group_id,
      product_capacity_id,
      product_contract_id,
      producer_id,
      product_name,
      product_buy_type,
    } = param;
    const query: any = { deleted: false };

    if (product_buy_type) {
      query.buy_type = product_buy_type;
    }

    if (product_name) {
      query.name = { $regex: product_name, $options: 'i' };
    }

    if (typeId) {
      query.type_service_id = typeId;
    }

    if (product_group_id) {
      query.service_group_id = product_group_id;
    }

    if (product_capacity_id) {
      query.capacity_id = product_capacity_id;
    }

    if (product_contract_id) {
      query.contract_id = product_contract_id;
    }

    if (producer_id) {
      query.producer_info.producer_id = producer_id;
    }

    return query;
  }

  async buildQuery(param: GetTypeDto, groupIds?: string[]): Promise<any> {
    const { name, id, type, code } = param;

    const query: any = { deleted: false };

    if (groupIds?.length > 0) {
      query.group_id = { $in: groupIds };
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (id) {
      query._id = id;
    }

    if (type) {
      query.type = { $regex: type, $options: 'i' };
    }

    if (code) {
      query.code = { $regex: code, $options: 'i' };
    }

    return query;
  }

  async findType(query: any, param: GetTypeDto): Promise<Type[]> {
    return this.typeModel
      .find(query)
      .skip((param.page - 1) * param.limit)
      .limit(param.limit)
      .sort({ createdAt: param.sort });
  }

  async countTypes(query: any): Promise<number> {
    return this.typeModel.find(query).countDocuments();
  }

  async findProductByServiceInfoIds(
    serviceIds: string[],
    param: GetTypeDto,
    type: Type,
  ): Promise<{ result: Product[]; total: number; lastPage: number }> {
    const { limit, page } = this.getPageAndLimitById(param, type['id']);

    let query: any = {};
    query.service_info_id = { $in: serviceIds };
    query = this.buildQueryProduct(query, param);

    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .populate([
          { path: 'buying_fee', populate: [{ path: 'unit_id', model: this.unitModel }] },
          { path: 'unit_id', model: this.unitModel },
          { path: 'currency_unit_id', model: this.unitModel },
          { path: 'supplier_id', model: this.supplierModel },
          {
            path: 'histories',
            populate: [
              { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
              { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
              { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
            ],
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: 1 }),
      this.productModel.find(query).countDocuments(),
    ]);

    return {
      result: products,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async findProducts(query: any, page: number, limit: number): Promise<Product[]> {
    return await this.productModel
      .find(query)
      .populate([{ path: 'buying_fee', populate: [{ path: 'unit_id', model: this.unitModel }] }])
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async countProductInfos(query: any): Promise<number> {
    return this.productModel.find(query).countDocuments();
  }

  getPageAndLimitById(param: GetTypeDto, id: string): { page: number; limit: number } {
    let page = 1;
    let limit = 10;

    if (param[`${id}_page`]) {
      page = param[`${id}_page`];
    }
    if (param[`${id}_limit`]) {
      limit = param[`${id}_limit`];
    }

    return { page, limit };
  }

  async createType(createCapacityDto: CreateTypeDto): Promise<void> {
    await this.typeModel.create(createCapacityDto);
  }

  async updateType(_id: string, updateTypeDto: UpdateTypeDto): Promise<void> {
    const type = await this.typeModel.findOne({ _id });
    if (!type) {
      throw new BadRequestException(httpErrors.TYPE_NOT_FOUND);
    }
    this.typeModel.findOneAndUpdate({ _id }, updateTypeDto, { new: true });
  }
}
