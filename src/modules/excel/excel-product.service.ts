import { BadRequestException, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Producer } from '../producer/schemas/producer.schema';
import * as xlsx from 'xlsx';
import { ExcelService } from './excel.service';
import { InfoExcelConvertDto } from './dto/info-excel-convert.dto';
import { CreateErrorInfoDto } from './dto/error-info.dto';
import { Response } from 'express';
import { ERROR } from 'src/shares/message/excel.message';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';
import { ConvertProductDto } from './dto/convert-product.dto';

export enum TypeInputExcel {
  month = 'Gia hạn',
  full = 'Thanh toán một lần',
}

@Injectable()
export class ExcelProductService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private excelService: ExcelService,
  ) {}

  async importProductExcel(file: Express.Multer.File, res: Response, create_by: string): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const dataInput = this.excelService.formatDataFileInput(workbook);
    const { errorInfo, validProductService } = await this.filterDataProduct(dataInput, create_by);

    // create product service
    await this.productModel.create(validProductService);

    // send file check error
    if (errorInfo.length > 0) {
      const dataExcelFormatError = this.excelService.formatDataError(workbook, errorInfo);
      const excelBuffer = this.excelService.getExcelInfo(workbook, dataExcelFormatError);
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=example.xlsx',
      });
      res.send({ buffer: excelBuffer });
    } else {
      res.send();
    }
  }

  async filterDataProduct(
    data: InfoExcelConvertDto[],
    create_by: string,
  ): Promise<{ errorInfo: CreateErrorInfoDto[]; validProductService: Product[] }> {
    const errorInfo: CreateErrorInfoDto[] = [];
    const validProductService: Product[] = [];

    if (!this.excelService.isValidTypeService(data)) {
      throw new BadRequestException();
    }

    const product_service_type_name = this.excelService.getTypeAndKeyName(data);
    const key_field_name = this.excelService.getTypeAndKeyName(data);
    const dataInputConvert = this.convertDataProductExcel(data?.slice(1), product_service_type_name, key_field_name);

    await Promise.all(
      dataInputConvert.map(async (_) => {
        const descError: string[] = [];

        // convert type_product_id
        const type_product_id = (await this.excelService.getTypeByName(product_service_type_name))?.['_id'];

        // validate type type_product_id
        if (!type_product_id) {
          descError.push(ERROR.TYPE_PRODUCT_NOT_FOUND);
        } else if (!type_product_id) {
          descError.push(ERROR.TYPE_PRODUCT_NOT_FOUND_IN_DB);
        }

        // convert status
        const status = this.getStatusProductService(_?.status_input);
        // validate status
        if (!_?.status_input) {
          descError.push(ERROR.STATUS_NOT_FOUND);
        }
        if (!status) {
          descError.push(ERROR.STATUS_INVALID);
        }

        // convert supplier_id
        const supplier_id = (await this.getSupplier(_?.supplier_name))?.['_id'];
        // validate supplier_id
        if (!_?.supplier_name) {
          descError.push(ERROR.SUPPLIER_NOT_FOUND);
        }
        if (!supplier_id) {
          descError.push(ERROR.SUPPLIER_USE_NOT_FOUND_IN_DB);
        }

        // convert service_group_id
        const service_group_id = (await this.excelService.findGroupByName(_?.service_group_name))?.['_id'];
        // validate service_group_id
        if (!_?.service_group_name) {
          descError.push(ERROR.SERVICE_GROUP_NOT_FOUND);
        }
        if (!service_group_id) {
          descError.push(ERROR.SERVICE_GROUP_NOT_FOUND_IN_DB);
        }

        // convert producer_id
        const producer_id = (await this.excelService.findProducerByName(_?.producer_name))?.['_id'];
        // validate producer_id
        if (!_?.producer_name) {
          descError.push(ERROR.PRODUCER_USE_NOT_FOUND);
        }
        if (!producer_id) {
          descError.push(ERROR.PRODUCER_USE_NOT_FOUND_IN_DB);
        }

        // convert currency_unit_id
        const currency_unit_id = (await this.excelService.findUnitByName(_?.currency_unit_name))?.['_id'];
        // validate currency_unit_id
        if (!_?.currency_unit_name) {
          descError.push(ERROR.CURRENCY_UNIT_NOT_FOUND);
        }
        if (!currency_unit_id) {
          descError.push(ERROR.CURRENCY_UNIT_NOT_FOUND_IN_DB);
        }

        // convert unit_id
        const unit_id = (await this.excelService.findUnitByName(_?.unit_name))?.['_id'];
        // validate  unit_id
        if (!_?.unit_name) {
          descError.push(ERROR.UNIT_NOT_FOUND);
        }
        if (!unit_id) {
          descError.push(ERROR.UNIT_NOT_FOUND_IN_DB);
        }

        // convert product info id
        const product_info_id = (await this.excelService.findProductInfoByCode(_?.code))?.['_id'];
        // validate product info id
        if (!_?.code) {
          descError.push(ERROR.CODE_NOT_FOUND);
        }

        if (!product_info_id) {
          descError.push(ERROR.PRODUCT_INFO_CODE_NOT_FOUND_IN_DB);
        }

        // convert import_date
        const { error: error_import_date, date: import_date } = this.excelService.convertToDate(
          _?.import_date,
          'ngày nhập',
        );
        // validate import_date
        if (error_import_date.length > 0) {
          descError.push(...error_import_date);
        }

        // convert inactive_date
        const { error: error_inactive_date, date: inactive_date } = this.excelService.convertToDate(
          _?.inactive_date,
          'ngày hết hạn sim',
        );
        // validate inactive_date
        if (error_inactive_date.length > 0) {
          descError.push(...error_inactive_date);
        }

        if (descError.length > 0) {
          errorInfo.push({
            desc: descError,
            info: _[key_field_name],
            row: _?.row,
          });
        } else {
          const productServiceValid: any = _;
          productServiceValid.unit_id = unit_id?.toString();
          productServiceValid.import_date = import_date;
          productServiceValid.inactive_date = inactive_date;
          productServiceValid.currency_unit_id = currency_unit_id.toString();
          productServiceValid.supplier_id = supplier_id.toString();
          productServiceValid.product_info_id = product_info_id.toString();
          productServiceValid.status = status.toString() as ProductStatusEnum;
          productServiceValid.supplier_id = supplier_id.toString();
          const data: Product = productServiceValid;

          (productServiceValid.histories = [
            { create_by, info: JSON.stringify(productServiceValid), created_at: new Date() },
          ]),
            validProductService.push(data);
        }
      }),
    );

    return {
      errorInfo,
      validProductService,
    };
  }

  convertDataProductExcel(
    data: InfoExcelConvertDto[],
    product_type_name: string,
    key_field_name: string,
  ): ConvertProductDto[] {
    return data.map((_) => {
      return {
        product_type_name: product_type_name?.trim(),
        ID: _[`${key_field_name}`]?.toString()?.trim(),
        imei: _?.__EMPTY?.toString().trim(),
        iccid: _?.__EMPTY_1?.toString(),
        code: _?.__EMPTY_2,
        supplier_name: _?.__EMPTY_4,
        service_name: _?.__EMPTY_5,
        service_group_name: _?.__EMPTY_6,
        unit_name: _?.__EMPTY_7,
        import_date: _?.__EMPTY_8,
        inactive_date: _?.__EMPTY_9,
        producer_name: _?.__EMPTY_10,
        currency_unit_name: _?.__EMPTY_11,
        buying_price: _?.__EMPTY_12,
        status_input: _?.__EMPTY_13,
        desc: _?.__EMPTY_14,
        row: _?.row,
      };
    });
  }

  getStatusProductService(status: string): string | null {
    const statusConvert = this.excelService.formatString(status);
    const statusEnum = {
      SOLD: 'đã bán',
      ACTIVE: 'hoạt động',
      INACTIVE: 'không hoạt động',
      LOCKED: 'khóa',
      IN_STOCK: 'trong kho',
      APPLIED: 'đã lên đơn',
      SHIPPING: 'đang vận chuyển',
      USE: 'đang sử dụng',
      RETURNING: 'đang đổi trả',
      NETWORK_IS_CUT: 'đã cắt mạng',
      NETWORK_IS_OPEN: 'đang mở mạng',
      SAIHAKKO: 'đang saihakko',
      EXPIRED: 'hết hạn',
      CANCEL_THE_CONTRACT: 'hủy hợp đồng',
      MAINTAINING: 'đang bảo trì',
      HOLD: 'giữ hộ',
    };

    if (Object.values(statusEnum).includes(statusConvert?.trim()?.toLowerCase())) {
      return this.excelService.getKeyByValue(statusEnum, statusConvert);
    }
    return null;
  }

  async getSupplier(supplierName: string): Promise<Producer> {
    if (!supplierName) return null;

    return await this.supplierModel.findOne({
      $expr: { $eq: [{ $toLower: '$name' }, this.excelService.formatString(supplierName)] },
    });
  }
}
