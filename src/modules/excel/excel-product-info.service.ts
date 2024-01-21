import { BadRequestException, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as xlsx from 'xlsx';
import { ExcelService } from './excel.service';
import { InfoExcelConvertDto } from './dto/info-excel-convert.dto';
import { CreateErrorInfoDto } from './dto/error-info.dto';
import { Response } from 'express';
import { ERROR } from 'src/shares/message/excel.message';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';
import { ProductInfo, ProductInfoDocument } from '../product-info/schemas/product-info.schema';
import { ConvertProductInfoInputDto } from './dto/convert-product-info.dto';

export enum TypeInputExcel {
  month = 'Gia hạn',
  full = 'Thanh toán một lần',
}

@Injectable()
export class ExcelProductInfoService {
  constructor(
    @InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>,
    private excelService: ExcelService,
  ) {}

  async importProductInfoExcel(file: Express.Multer.File, res: Response, create_by: string): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const dataInput = this.excelService.formatDataFileInput(workbook);
    const { errorInfo, validProductInfo } = await this.filterDataProductInfo(dataInput, create_by);

    // create product info
    await this.productInfoModel.create(validProductInfo);

    // send file check error
    if (errorInfo.length > 0) {
      const dataExcelFormatError = this.excelService.formatDataError(workbook, errorInfo);
      const excelBuffer = this.excelService.getExcelInfo(workbook, dataExcelFormatError);
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=example.xlsx',
      });

      res.status(200).send({ buffer: excelBuffer });
    } else {
      res.send();
    }
  }

  // Promise<{ errorInfo: CreateErrorInfoDto[]; validService: ServiceInfo[] }>
  async filterDataProductInfo(data: InfoExcelConvertDto[], create_by: string): Promise<any> {
    const errorInfo: CreateErrorInfoDto[] = [];
    const validProductInfo: ProductInfo[] = [];

    if (!this.excelService.isValidTypeService(data)) {
      throw new BadRequestException();
    }

    const product_type_name = this.excelService.getTypeAndKeyName(data);
    const key_field_name = this.excelService.getTypeAndKeyName(data);

    const dataInputConvert = this.convertDataProductInfoExcel(data.slice(2), product_type_name, key_field_name);

    await Promise.all(
      dataInputConvert.map(async (_) => {
        const descError: string[] = [];

        // convert product_type_id
        const product_type_id = (await this.excelService.getTypeByName(product_type_name))?.['_id'];

        // validate product_type_id
        if (!product_type_name) {
          descError.push(ERROR.TYPE_PRODUCT_NOT_FOUND);
        } else if (!product_type_id) {
          descError.push(ERROR.TYPE_PRODUCT_NOT_FOUND_IN_DB);
        }

        // validate name
        if (!_.name) {
          descError.push(ERROR.NAME_PRODUCT_INFO_NOT_FOUND);
        }

        // convert group_id
        const group_id = (await this.excelService.findGroupByName(_?.group_name))?.['_id'];
        // validate group_id
        if (!_?.group_name) {
          descError.push(ERROR.PRODUCT_INFO_GROUP_NOT_FOUND);
        }
        if (!group_id) {
          descError.push(ERROR.PRODUCT_INFO_NOT_FOUND_IN_DB);
        }

        // convert type_product_use_id
        const type_product_use_id = (await this.excelService.findTypeUseByName(_?.type_product_use_name))?.['_id'];
        // validate type_product_use_id
        if (!_?.type_product_use_name) {
          descError.push(ERROR.TYPE_PRODUCT_INFO_USE_NOT_FOUND);
        } else if (!type_product_use_id) {
          descError.push(ERROR.TYPE_PRODUCT_INFO_USE_NOT_FOUND_IN_DB);
        }

        const currency_unit_id = (await this.excelService.findCurrencyUnitByName(_?.currency_unit_name))?.['_id'];
        if (!_?.currency_unit_name) {
          descError.push(ERROR.CURRENCY_UNIT_NOT_FOUND);
        } else if (!currency_unit_id) {
          descError.push(ERROR.CURRENCY_UNIT_NOT_FOUND_IN_DB);
        }

        const producer_id = (await this.excelService.findProducerByName(_?.producer_info?.producer_name))?.['_id'];
        if (!_?.producer_info?.producer_name) {
          descError.push(ERROR.PRODUCER_USE_NOT_FOUND);
        }
        if (!producer_id) {
          descError.push(ERROR.PRODUCER_USE_NOT_FOUND_IN_DB);
        }

        const unit_id = (await this.excelService.findUnitByName(_?.unit_name))?.['_id'];

        if (!_?.unit_name) {
          descError.push(ERROR.UNIT_NOT_FOUND);
        }
        if (!unit_id) {
          descError.push(ERROR.UNIT_NOT_FOUND_IN_DB);
        }

        const status = this.excelService.getStatusServiceInfo(_?.status_input);
        if (!_?.status_input) {
          descError.push(ERROR.STATUS_NOT_FOUND);
        }
        if (!status) {
          descError.push(ERROR.STATUS_INVALID);
        }

        const attributes = this.excelService.formatAttributes(_?.attributes_input);
        let selling_exchanges = [];
        const { selling_exchanges_format, listError } = this.excelService.formatSellingExchangesFees(
          _?.selling_exchanges_input,
        );
        if (listError.length > 0) {
          descError.push(...listError);
        } else {
          selling_exchanges = await Promise.all(
            selling_exchanges_format.map(async (sx) => {
              const { price, exchange_type_symbol, quantity, unit_name } = sx;
              const unit_id = (await this.excelService.findUnitByName(unit_name))?.['_id'];
              const exchange_type = this.excelService.convertSymbolToValue(exchange_type_symbol);

              // valid unit_id
              if (!unit_id) {
                descError.push(ERROR.SELLING_EXCHANGES_UNIT_NOT_FOUND_IN_DB);
              }

              if (exchange_type === null) {
                descError.push(ERROR.SELLING_EXCHANGES_TYPE_INVALID);
              }

              if (price && exchange_type && quantity && unit_id) {
                return { price, exchange_type, quantity, unit_id };
              } else {
                descError.push(ERROR.SELLING_EXCHANGES_INVALID);
                return;
              }
            }),
          );
        }

        if (descError.length > 0) {
          errorInfo.push({
            desc: descError,
            info: _[key_field_name],
            row: _?.row,
          });
        } else {
          const productInfoValid: any = _;
          productInfoValid.product_type_id = product_type_id.toString();
          productInfoValid.group_id = group_id.toString();
          productInfoValid.type_product_use_id = type_product_use_id.toString();
          productInfoValid.unit_id = unit_id.toString();
          productInfoValid.attributes = attributes || [];
          productInfoValid.currency_unit_id = currency_unit_id.toString();
          productInfoValid.producer_info.producer_id = producer_id.toString();

          productInfoValid.selling_exchanges = selling_exchanges;
          productInfoValid.status = status as ProductStatusEnum;
          const data: ProductInfo = productInfoValid;
          (productInfoValid.histories = [
            { create_by, info: JSON.stringify(productInfoValid), created_at: new Date() },
          ]),
            validProductInfo.push(data);
        }
      }),
    );

    return {
      errorInfo,
      validProductInfo,
    };
  }

  convertDataProductInfoExcel(
    data: InfoExcelConvertDto[],
    product_type_name: string,
    key_field_name: string,
  ): ConvertProductInfoInputDto[] {
    return data.map((_) => {
      return {
        code: _?.__EMPTY?.trim(),
        product_type_name: product_type_name?.trim(),
        name: _[`${key_field_name}`]?.trim(),
        group_name: _?.__EMPTY_2,
        type_product_use_name: _?.__EMPTY_3,
        unit_name: _?.__EMPTY_4,
        attributes_input: _?.__EMPTY_5,
        currency_unit_name: _?.__EMPTY_6,
        desc: _?.__EMPTY_7,
        producer_info: {
          producer_name: _?.__EMPTY_8,
          product_production_location: _?.__EMPTY_9,
        },
        selling_exchanges_input: _?.__EMPTY_10,
        default_selling_price: _?.__EMPTY_11,
        status_input: _?.__EMPTY_12,
        row: _?.row,
      };
    });
  }
}
