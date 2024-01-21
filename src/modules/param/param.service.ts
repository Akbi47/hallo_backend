import { Injectable, BadRequestException, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Param, ParamDocument } from './schemas/param.schema'
import { Model } from 'mongoose'
import { CreateParamDto } from './dto/create-param.dto'
import { UpdateParamDto } from './dto/update-param.dto'
import { httpErrors } from 'src/shares/exceptions'
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema'
import { GetParamDto, GetParamInfoDto } from './dto/get-param.dto'
import { Type, TypeDocument } from '../type/schemas/type.schema'
import { Capacity, CapacityDocument } from '../capacity/schemas/capacity.schema'
import { Group, GroupDocument } from '../group/schemas/group.schema'
import { Unit, UnitDocument } from '../unit/schema/unit.schema'
import { Device, DeviceDocument } from '../device/schemas/device.schema'
import { Contract, ContractDocument } from '../contract/schema/contracts.schema'
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema'
import { BuyType } from 'src/shares/enums/service-info.enum'
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema'
import { TypeTypeEnum } from 'src/shares/enums/type.enum'
import { ShippingMethod, ShippingMethodDocument } from '../shipping-method/schemas/shipping-method.schema'
import { Product, ProductDocument } from '../product/schemas/product.schema'
import { Gift, GiftDocument } from '../gift/schemas/gift.schema'
import { ApplyProductAndService, SubjectsToApply, TypeApplyDiscount } from 'src/shares/enums/promotional.enum'
import { convertEnum } from 'src/shares/helpers/utils'
import { ParamsHikari, ParamsHikariDocument } from '../params-hikari/schemas/params-hikari.schema'
import { ServiceHikari, ServiceHikariDocument } from '../service-hikari/schemas/service-hikari.schema'
import { Source, SourceDocument } from '../source/schemas/source.schema'
import { User, UserDocument } from '../user/schemas/user.schema'
import { SubServiceHikari, SubServiceHikariDocument } from '../sub-service-hikari/schemas/sub-service-hikari.schema'
import { ServiceHikariService } from '../service-hikari/service-hikari.service'
import { StatusEnum } from 'src/shares/enums/warranty.enum'

@Injectable()
export class ParamService {
  constructor(
    @InjectModel(Param.name) private paramModel: Model<ParamDocument>,
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<CapacityDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(Group.name) private GroupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(TypeUse.name) private typeUseModel: Model<TypeUseDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
    @InjectModel(ShippingMethod.name) private shippingMethodModel: Model<ShippingMethodDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Gift.name) private giftModel: Model<GiftDocument>,
    @InjectModel(ParamsHikari.name)
    private paramsHikariModel: Model<ParamsHikariDocument>,
    @InjectModel(ServiceHikari.name)
    private serviceHikariModel: Model<ServiceHikariDocument>,
    @InjectModel(SubServiceHikari.name)
    private subServiceHikariModel: Model<SubServiceHikariDocument>,
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly serviceHikariService: ServiceHikariService
  ) {}

  async getInfoAllParams(): Promise<any> {
    // const serviceHikari = await this.serviceHikariModel.find()
    // const subServiceHikari = await this.subServiceHikariModel.find()

    const serviceHikari = await this.serviceHikariService.findParams()

    const paramsHikari = await this.paramsHikariModel.aggregate([
      {
        $group: {
          _id: '$type',
          records: { $push: '$$ROOT' },
        },
      },
    ])

    const source = await this.sourceModel.find()

    const userSale = await this.userModel.find({ role: 2 })

    return {
      serviceHikari,
      paramsHikari,
      source,
      userSale,
    }
  }

  async getInfoParam(query: GetParamInfoDto): Promise<any> {
    const { type } = query
    const queryType: any = {}
    const queryGroup: any = {}
    const queryTypeUse: any = {}
    const buy_type = Object.keys(BuyType).reduce((object, key) => {
      const value = BuyType[key]
      return { ...object, [key]: value }
    }, {})

    if (type) {
      queryType.type = type
      queryGroup.type = type
      queryTypeUse.type = type
    }
    const [capacities, type_, group, suppliers, units, contracts, devices, type_uses, producers, unit_currencies] = await Promise.all([
      this.capacityModel.find({ deleted: false }),
      this.typeModel
        .aggregate([
          { $match: queryTypeUse },
          {
            $lookup: {
              from: 'service_infos',
              localField: '_id',
              foreignField: 'type_service_id',
              as: 'service_infos',
            },
          },
        ])
        .exec(),
      this.GroupModel.find({ deleted: false, ...queryGroup }),
      this.supplierModel.find({ deleted: false }),
      this.unitModel.find({ deleted: false, is_money: false }),
      this.contractModel.find({ deleted: false }),
      this.deviceModel.find({ deleted: false }),
      this.typeUseModel.find({ deleted: false, ...queryType }),
      this.producerModel.find({ deleted: false }),
      this.unitModel.find({ deleted: false, is_money: true }),
    ])

    const listStatusWarranty = [];
    for (const property in convertEnum(StatusEnum)) {
      listStatusWarranty.push({ name: property, _id: convertEnum(StatusEnum)[property] });
    }

    return {
      unit_currencies,
      units,
      capacities,
      contracts,
      devices:
        devices.map((_: any) => {
          const { _id, name, status, desc, buying_price, selling_price, deleted, createdAt, updatedAt } = _
          return {
            _id,
            name,
            status,
            desc,
            buying_price: buying_price.toString(),
            selling_price: selling_price.toString(),
            deleted,
            createdAt,
            updatedAt,
          }
        }) || [],
      type: type_.map((t) => {
        const service_infos = t.service_infos.map((s) => {
          return { name: s.name, _id: s._id }
        })
        return { ...t, service_infos }
      }),
      group: group,
      suppliers,
      producers,
      type_uses: type_uses,
      buy_type,
      status_warranty: listStatusWarranty,
    }
  }

  async getParamPromotion(): Promise<any> {
    const [groups, unit_currencies, shippings, products, gifts] = await Promise.all([
      this.GroupModel.find({
        deleted: false,
        type: TypeTypeEnum.promotion,
      }).select('_id name code'),
      this.unitModel.find({ deleted: false, is_money: true }).select('_id name'),
      this.shippingMethodModel.find({ deleted: false }).select('_id name code '),
      this.productModel.find({ deleted: false }).select('_id name ID '),
      this.giftModel.find({ deleted: false }).select('_id name'),
    ])

    return {
      groups,
      unit_currencies,
      shippings,
      products,
      gifts,
      tpe_apply_discount: convertEnum(TypeApplyDiscount),
      subjects_to_apply: convertEnum(SubjectsToApply),
      apply_product_and_service: convertEnum(ApplyProductAndService),
    }
  }

  async findOne(query: GetParamDto): Promise<any> {
    const { name } = query

    const [param, units, contracts, devices] = await Promise.all([
      this.paramModel
        .findOne({ name })
        .select('-__v -createdAt -updatedAt +_id')
        .populate([
          {
            path: 'capacities',
            model: this.capacityModel,
            select: 'name _id',
            match: { deleted: false },
          },
          {
            path: 'types',
            model: this.typeModel,
            select: '_id name desc code type',
            match: { deleted: false },
          },
          {
            path: 'groups',
            model: this.GroupModel,
            select: 'name _id code type',
            match: { deleted: false },
          },
          {
            path: 'suppliers',
            model: this.supplierModel,
            select: 'name _id',
            match: { deleted: false },
          },
          {
            path: 'type_uses',
            model: this.typeUseModel,
            select: 'name _id type',
          },
        ])
        .exec(),
      this.unitModel.find({ deleted: false }),
      this.contractModel.find({ deleted: false }),
      this.deviceModel.find({ deleted: false }),
    ])

    if (!param) {
      throw new BadRequestException(httpErrors.PARAM_NOT_FOUND)
    }

    return {
      _id: param._id,
      capacities: param?.capacities || [],
      type: param?.types || [],
      type_uses: param?.type_uses || [],
      group: param?.groups || [],
      suppliers: param?.suppliers || [],
      units: units || [],
      contracts: contracts || [],
      devices:
        devices.map((_: any) => {
          const { _id, name, status, desc, buying_price, selling_price, deleted, createdAt, updatedAt } = _
          return {
            _id,
            name,
            status,
            desc,
            buying_price: buying_price.toString(),
            selling_price: selling_price.toString(),
            deleted,
            createdAt,
            updatedAt,
          }
        }) || [],
    }
  }

  async createParam(createParamDto: CreateParamDto): Promise<void> {
    await this.paramModel.create(createParamDto)
  }

  async updateParam(_id: string, updateParamDto: UpdateParamDto): Promise<Param> {
    const param = await this.paramModel.findOne({ _id })
    if (!param) {
      throw new BadRequestException(httpErrors.PARTNER_NOT_FOUND)
    }
    return await this.paramModel.findOneAndUpdate({ _id }, updateParamDto, {
      new: true,
    })
  }

  async deleteParam(_id: string): Promise<void> {
    await this.paramModel.findOneAndDelete({ _id })
  }
}
