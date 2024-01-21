import { Injectable, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ServiceInfo, ServiceInfoDocument, SellingFee, ProducerInfo } from './schemas/service-info.schema';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Capacity } from '../capacity/schemas/capacity.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { Type, TypeDocument } from '../type/schemas/type.schema';
import { Device, DeviceDocument } from '../device/schemas/device.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';

import { CreateServiceInfoDto } from './dto/create-service-info.dto';
import { UpdateServiceInfoDto } from './dto/update-service-info.dto';
import { GetServiceInfoDto } from './dto/get-service-info.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

import { httpErrors } from 'src/shares/exceptions';
import { sortHistories } from 'src/shares/helpers/utils';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { ResFormatServiceInfoDto } from './dto/res-format-service-info.dto';
import { MapServiceInfoDto } from './dto/res-map-service-info.dto';
import { ExcelService } from '../excel/excel.service';
import { Response } from 'express';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';
import { ExcelServiceInfoTelecomService } from '../excel/excel-service-info-telecom.service';
import { ExcelServiceInfoService } from '../excel/excel-service-info.service';

@Injectable()
export class ServiceInfoService {
  constructor(
    @InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<Capacity>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(TypeUse.name) private typeUseModel: Model<TypeUseDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private excelService: ExcelService,
    private excelServiceInfoTelecomService: ExcelServiceInfoTelecomService,
    private excelServiceInfoService: ExcelServiceInfoService,
  ) {}

  async exportFileExcel(param: GetServiceInfoDto, res: Response): Promise<void> {
    const query = await this.buildQuery(param);
    const serviceInfos = await this.findServiceInfos(query, param);
    const result = this.mapServicesInfo(serviceInfos);

    const mapService = result.map((_) => {
      if (_?.histories) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { histories, ...result } = _;
        return result;
      }
      return _;
    });

    if (mapService.length > 0) {
      this.excelService.exportToExcel(mapService, res, 'service-info');
    } else {
      res.send();
    }
  }

  async getProductOfServiceInfo(param: GetServiceInfoDto): Promise<ResPagingDto<ResFormatServiceInfoDto[]>> {
    const query = await this.buildQuery(param);
    const [serviceInfos, total] = await Promise.all([
      this.findServiceInfos(query, param),
      this.countServiceInfos(query),
    ]);

    const result = this.mapServicesInfo(serviceInfos);

    const serviceFormat = await this.formatServiceInfos(result, param);

    return {
      result: serviceFormat,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async formatServiceInfos(
    serviceMap: MapServiceInfoDto[],
    param: GetServiceInfoDto,
  ): Promise<ResFormatServiceInfoDto[]> {
    return Promise.all(
      serviceMap.map(async (_: MapServiceInfoDto) => {
        const {
          name,
          buy_type,
          service_group_name,
          capacity_name,
          contract_name,
          producer_name,
          producer_id,
          selling_info,
          selling_fee,
        } = _;
        const { page, limit } = this.getProductPaging(param, _);

        const query = this.buildQueryProduct(_);

        const [products, total] = await Promise.all([
          this.findProducts(query, page, limit),
          this.countProductInfos(query),
        ]);

        return {
          name,
          type_service_name: _?.type_service_name,
          id: _?._id,
          buy_type,
          service_group_name,
          capacity_name,
          contract_name,
          producer_name,
          producer_id,
          selling_info,
          selling_fee,
          products,
          total,
          lastPage: Math.ceil(total / limit),
        };
      }),
    );
  }

  buildQueryProduct(mapServiceInfo: MapServiceInfoDto): any {
    const query: any = {};
    query.service_info_id = mapServiceInfo?._id;
    return query;
  }

  async findProducts(query: any, page: number, limit: number): Promise<Product[]> {
    return await this.productModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  getProductPaging(param: GetServiceInfoDto, mapServiceInfo: MapServiceInfoDto): { page: number; limit: number } {
    let page = 1;
    let limit = 10;
    if (param[`${mapServiceInfo['id']}_page`]) {
      page = param[`${mapServiceInfo['id']}_page`];
    }
    if (param[`${mapServiceInfo['id']}_limit`]) {
      limit = param[`${mapServiceInfo['id']}_limit`];
    }
    return { page, limit };
  }

  async countProductInfos(query: any): Promise<number> {
    return this.productModel.find(query).countDocuments();
  }

  async find(param: GetServiceInfoDto): Promise<ResPagingDto<MapServiceInfoDto[]>> {
    const query = await this.buildQuery(param);
    const [serviceInfos, total] = await Promise.all([
      this.findServiceInfos(query, param),
      this.countServiceInfos(query),
    ]);
    const result = this.mapServicesInfo(serviceInfos);
    return {
      result,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async buildQuery(param: GetServiceInfoDto): Promise<any> {
    const {
      name,
      id,
      desc,
      buy_type,
      code,
      contract_name,
      deposit,
      activation_fee,
      selling_price,
      total_price,
      // currency,
      type_service_id,
    } = param;

    const query: any = { deleted: false };

    if (type_service_id) {
      query.type_service_id = type_service_id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (id) {
      query._id = id;
    }

    if (desc) {
      query.desc = { $regex: desc, $options: 'i' };
    }

    if (buy_type) {
      query.buy_type = { $regex: buy_type, $options: 'i' };
    }

    if (code) {
      query.code = { $regex: code, $options: 'i' };
    }

    if (contract_name) {
      const contractIds = await this.contractModel.find({ name: { $regex: contract_name, $options: 'i' } });
      query['contract_id'] = { $in: contractIds };
    }

    if (deposit) {
      query['selling_info.deposit'] = deposit;
    }

    if (activation_fee) {
      query['selling_info.activation_fee'] = activation_fee;
    }

    if (selling_price) {
      query['selling_info.price'] = selling_price;
    }

    if (total_price) {
      query.$or = [{ 'selling_info.total': total_price }];
    }

    return query;
  }

  async findServiceInfos(query: any, param: GetServiceInfoDto): Promise<ServiceInfo[]> {
    const populateInfo = this.getPopulateServiceInfo();
    const qb = this.serviceInfoModel.find(query).select('-__v -updatedAt -deleted').populate(populateInfo);

    // pagination here because the query is custom
    if (param.page && param.limit) {
      qb.skip((param.page - 1) * param.limit);
    }
    if (param.limit) {
      qb.limit(param.limit);
    }
    qb.sort({ createdAt: param.sort || -1 });
    return qb.exec();
  }

  getPopulateServiceInfo(): any {
    return [
      {
        path: 'capacity_id',
        model: this.capacityModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'producer_info',
        populate: [{ path: 'producer_id', model: this.producerModel, select: '-__v  -deleted' }],
      },
      {
        path: 'contract_id',
        model: this.contractModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'service_group_id',
        model: this.groupModel,
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'type_service_id',
        model: this.typeModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'service_group_id',
        model: this.groupModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'type_service_use_id',
        model: this.typeUseModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'currency_unit_id',
        model: this.unitModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'unit_id',
        model: this.unitModel,
        match: { deleted: false },
        select: '-__v -createdAt -updatedAt -deleted',
      },
      {
        path: 'producer_info',
        populate: [
          {
            path: 'producer_id',
            model: this.producerModel,
            select: '-__v -createdAt -updatedAt -deleted',
          },
        ],
      },
      { path: 'selling_fee', populate: [{ path: 'unit_id', model: this.unitModel }] },
      {
        path: 'histories',
        populate: [
          { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
          { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
          { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
        ],
      },
    ];
  }

  async countServiceInfos(query: any): Promise<number> {
    return this.serviceInfoModel.find(query).countDocuments();
  }

  mapServicesInfo(servicesInfos: ServiceInfo[]): MapServiceInfoDto[] {
    return servicesInfos.map((serviceInfo: any) => {
      const producer: Producer | any = serviceInfo?.producer_info?.producer_id;
      const capacityInfo: Capacity | any = serviceInfo?.capacity_id;
      const typeService: Type | any = serviceInfo?.type_service_id;
      const contractInfo: Contract | any = serviceInfo?.contract_id;
      const serviceGroup: Group | any = serviceInfo?.service_group_id;
      const sellingFeeInfo: SellingFee | any = serviceInfo?.selling_fee;
      const producerInfo: ProducerInfo | any = serviceInfo?.producer_info;
      const typeServiceUse: TypeUse | any = serviceInfo?.type_service_use_id;
      const selling_exchanges: any = serviceInfo?.selling_exchanges;

      return {
        _id: serviceInfo?.id,
        name: serviceInfo?.name,
        code: serviceInfo?.code,
        buy_type: serviceInfo?.buy_type,
        capacity_name: capacityInfo?.name,
        capacity_id: capacityInfo?.id,
        producer_id: producer?._id,
        producer_name: producer?.name,
        service_production_location: serviceInfo?.producer_info?.service_production_location,
        type_service_name: typeService?.name,
        type_service_id: typeService?._id,
        type_service_use_id: typeServiceUse?._id,
        type_service_use_name: typeServiceUse?.name,
        contract_name: contractInfo?.name,
        contract_id: contractInfo?._id,
        service_group_name: serviceGroup?.name,
        service_group_id: serviceGroup?._id,
        desc: serviceInfo?.desc,
        image_url: serviceInfo?.image_url,
        other_fees: serviceInfo?.other_fees?.map((_) => {
          return {
            name: _?.name,
            price: _?.price?.toString(),
          };
        }),
        service_charges: serviceInfo?.service_charges?.map((_) => {
          return {
            name: _?.name,
            price: _?.price?.toString(),
          };
        }),
        selling_fee: {
          unit_name: sellingFeeInfo?.unit_id?.name,
          unit_id: sellingFeeInfo?.unit_id?._id,
          price: sellingFeeInfo?.price?.toString(),
        },
        selling_info: {
          deposit: serviceInfo?.selling_info?.deposit?.toString(),
          activation_fee: serviceInfo?.selling_info?.activation_fee?.toString(),
          network_opening_fee: serviceInfo?.selling_info?.network_opening_fee?.toString(),
          other_fee: serviceInfo?.selling_info?.other_fee?.toString(),
          total: serviceInfo?.selling_info?.total?.toString(),
        },
        producer_info: {
          producer: producerInfo?.producer_id,
          service_production_location: producerInfo?.service_production_location,
        },
        histories: sortHistories(serviceInfo?.histories || []),
        currency_unit_id: serviceInfo?.currency_unit_id?.id,
        currency_unit_name: serviceInfo?.currency_unit_id?.name,
        currency_unit_symbol: serviceInfo?.currency_unit_id?.symbol,
        status: serviceInfo?.status,
        createdAt: serviceInfo?.createdAt,
        attributes: serviceInfo?.attributes,
        unit_id: serviceInfo?.unit_id?.id,
        unit_name: serviceInfo?.unit_id?.name,
        selling_exchanges: selling_exchanges?.map((_) => {
          return {
            price: _?.price?.toString(),
            exchange_type: _?.exchange_type,
            quantity: _?.quantity,
            unit_id: _?.unit_id,
          };
        }),
        default_selling_price: serviceInfo.default_selling_price?.toString(),
        discount_price: serviceInfo.discount_price.toString(),
      };
    });
  }

  async createServiceInfo(payload: CreateServiceInfoDto, create_by: string): Promise<void> {
    const { selling_info, ...serviceInfo } = payload;
    let total_selling_fee = 0;

    if (selling_info) {
      total_selling_fee = [
        selling_info?.activation_fee,
        selling_info?.deposit,
        selling_info?.network_opening_fee,
        selling_info?.other_fee,
      ].reduce((acc, fee) => acc + (fee ?? 0), 0);
    }

    await this.serviceInfoModel.create({
      ...serviceInfo,
      selling_info: { ...selling_info, total: total_selling_fee },
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async updateServiceInfo(_id: string, payload: UpdateServiceInfoDto, update_by: string): Promise<ServiceInfo> {
    const serviceInfo: ServiceInfo = await this.serviceInfoModel.findOne({ _id });
    if (!serviceInfo) {
      throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND);
    }

    payload['histories'] = [
      ...(serviceInfo?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    return this.serviceInfoModel.findOneAndUpdate({ _id }, { ...payload }, { new: true });
  }

  async deleteServiceInfo(_id: string, delete_by: string): Promise<void> {
    const serviceInfo = await this.serviceInfoModel.findOne({ id: _id });
    if (!serviceInfo) {
      throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND);
    }
    const histories = [...(serviceInfo?.histories || []), { delete_by, created_at: new Date() }];
    await this.serviceInfoModel.findOneAndUpdate({ _id }, { deleted: true, histories });
  }

  async deleteServiceInfos(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const serviceInfo = await this.serviceInfoModel.findById(id);

        if (!serviceInfo) {
          throw new BadRequestException(httpErrors.SERVICE_NOT_FOUND);
        }

        const histories = [...(serviceInfo?.histories || []), { delete_by, created_at: new Date() }];

        await this.serviceInfoModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }

  // import file excel
  async importFileExcelTelecom(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelServiceInfoTelecomService.importServiceInfoTelecomExcel(file, res, userId);
  }

  async importFileExcel(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelServiceInfoService.importServiceInfoExcel(file, res, userId);
  }
}
