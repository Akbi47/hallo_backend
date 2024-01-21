import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductInfo, ProductInfoDocument } from './schemas/product-info.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetProductInfoDto } from './dto/get-product-info.dto';
import { UpdateProductInfoDto } from './dto/update-product-info.dto';
import { httpErrors } from 'src/shares/exceptions';
import { CreateProductInfoDto } from './dto/create-product-info.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { sortHistories } from 'src/shares/helpers/utils';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { Type, TypeDocument } from '../type/schemas/type.schema';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';
import { MapProductInfoDto } from './dto/map-product-info.dto';
import { ExcelService } from '../excel/excel.service';
import { Response } from 'express';
import { ExcelProductInfoService } from '../excel/excel-product-info.service';

@Injectable()
export class ProductInfoService {
  constructor(
    @InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(TypeUse.name) private typeUseModel: Model<TypeUseDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    private excelService: ExcelService,
    private excelProductInfo: ExcelProductInfoService,
  ) {}

  async importFileExcel(file: Express.Multer.File, res: Response, userId: string): Promise<void> {
    return this.excelProductInfo.importProductInfoExcel(file, res, userId);
  }

  async exportFileExcel(param: GetProductInfoDto, res: Response): Promise<void> {
    const query = await this.buildQuery(param);
    const serviceInfos = await this.findProductInfos(query, param);
    const mapProductInfos = this.mapProductInfo(serviceInfos);

    const result = mapProductInfos.map((_) => {
      if (_?.histories) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { histories, ...result } = _;
        return result;
      }
      return _;
    });

    if (result.length > 0) {
      this.excelService.exportToExcel(result, res, 'product-info');
    } else {
      res.send();
    }
  }

  async find(param: GetProductInfoDto): Promise<ResPagingDto<MapProductInfoDto[]>> {
    const query = this.buildQuery(param);

    const [result, total] = await Promise.all([this.findProductInfos(query, param), this.countProductInfo(query)]);

    const mapProductInfo = this.mapProductInfo(result);

    return {
      result: mapProductInfo,
      total,
      lastPage: Math.ceil(total / param.limit),
    };
  }

  async countProductInfo(query: any): Promise<number> {
    return this.productInfoModel.find(query).countDocuments();
  }

  async findProductInfos(query: any, param: GetProductInfoDto): Promise<ProductInfo[]> {
    const populateProductInfo = this.getPopulateProductInfo();
    const qb = this.productInfoModel.find(query).populate(populateProductInfo);

    if (param.page && param.limit) {
      qb.skip((param.page - 1) * param.limit);
    }

    if (param.limit) {
      qb.limit(param.limit);
    }

    qb.sort({ createdAt: param.sort || -1 });

    return qb.exec();
  }

  getPopulateProductInfo(): any {
    return [
      {
        path: 'group_id',
        model: this.groupModel,
        select: '-__v  -deleted',
      },
      {
        path: 'type_product_use_id',
        model: this.typeUseModel,
        select: '-__v  -deleted',
      },
      {
        path: 'product_type_id',
        model: this.typeModel,
        select: '-__v  -deleted',
      },
      {
        path: 'currency_unit_id',
        model: this.unitModel,
        select: '-__v  -deleted',
      },
      {
        path: 'unit_id',
        model: this.unitModel,
        select: '-__v  -deleted',
      },
      {
        path: 'producer_info',
        populate: [{ path: 'producer_id', model: this.producerModel, select: '-__v  -deleted' }],
      },
      {
        path: 'selling_exchanges',
        populate: { path: 'unit_id', model: this.unitModel, select: '-__v  -deleted' },
      },
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

  buildQuery(param: GetProductInfoDto): any {
    const { deleted, id, name, currency, product_type_id } = param;
    const query: any = {};
    query.deleted = false;

    if (currency) {
      query.currency = currency;
    }

    if (product_type_id) {
      query.product_type_id = product_type_id;
    }

    if (deleted) {
      query.deleted = false;
    }

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    return query;
  }

  mapProductInfo(productInfos: ProductInfo[]): MapProductInfoDto[] {
    return productInfos.map((productInfo: any) => {
      return {
        _id: productInfo?.id,
        product_type_id: productInfo?.product_type_id?._id,
        product_type_name: productInfo?.product_type_id?.name,
        status: productInfo?.status,
        name: productInfo?.name,
        code: productInfo?.code,
        group_name: productInfo?.group_id?.name,
        group_id: productInfo?.group_id?._id,
        type_product_use_id: productInfo?.type_product_use_id?._id,
        type_product_use_name: productInfo?.type_product_use_id?.name,
        currency_unit_id: productInfo?.currency_unit_id?._id,
        currency_unit_name: productInfo?.currency_unit_id?.name,
        currency_unit_symbol: productInfo?.currency_unit_id?.symbol,
        unit_id: productInfo?.unit_id?._id,
        unit_name: productInfo?.unit_id?.name,
        producer_info: {
          producer_id: productInfo?.producer_info?.producer_id?._id,
          producer_name: productInfo?.producer_info?.producer_id?.name,
          product_production_location: productInfo?.producer_info?.product_production_location,
        },
        attribute: productInfo.attribute,
        selling_exchanges: productInfo?.selling_exchanges?.map((_: any) => {
          return {
            price: _?.price?.toString(),
            unit_id: _?.unit_id?._id?.toString(),
            unit_name: _?.unit_id?.name,
            exchange_type: _?.exchange_type,
            quantity: _?.quantity,
          };
        }),
        default_selling_price: productInfo?.default_selling_price?.toString(),
        discount_price: productInfo?.discount_price.toString(),
        histories: sortHistories(productInfo?.histories || []),
        deleted: productInfo?.deleted,
        image_url: productInfo?.image_url,
        desc: productInfo?.desc,
        createdAt: productInfo?.createdAt,
        attributes: productInfo?.attributes,
      };
    });
  }

  async findByIdAndUpDate(id: string, payload: UpdateProductInfoDto, update_by: string): Promise<void> {
    const product = await this.productInfoModel.findById(id);
    if (!product) {
      throw new BadRequestException(httpErrors.PRODUCT_INFO_NOT_FOUND);
    }

    payload['histories'] = [
      ...(product?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    await this.productInfoModel.findOneAndUpdate({ _id: id }, payload);
  }

  async createProductInfo(payload: CreateProductInfoDto, create_by: string): Promise<void> {
    await this.productInfoModel.create({
      ...payload,
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async deleteById(_id: string, delete_by: string): Promise<void> {
    const productInfo = await this.productInfoModel.findOne({ _id });
    if (!productInfo) {
      throw new BadRequestException(httpErrors.PRODUCT_INFO_NOT_FOUND);
    }
    const histories = [...(productInfo?.histories || []), { delete_by, created_at: new Date() }];
    await this.productInfoModel.findOneAndUpdate({ _id }, { deleted: true, histories });
  }

  async deleteIds(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const serviceInfo = await this.productInfoModel.findById(id);

        if (!serviceInfo) {
          throw new BadRequestException(httpErrors.PRODUCT_INFO_NOT_FOUND);
        }

        const histories = [...(serviceInfo?.histories || []), { delete_by, created_at: new Date() }];

        await this.productInfoModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }
}
