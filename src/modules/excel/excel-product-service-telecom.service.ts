import { BadRequestException, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Producer } from '../producer/schemas/producer.schema';
import * as xlsx from 'xlsx';
// import * as Excel from 'exceljs';
import { ExcelService } from './excel.service';
import { InfoExcelConvertDto } from './dto/info-excel-convert.dto';
import { CreateErrorInfoDto } from './dto/error-info.dto';
import { ConvertProductServiceTelecomDto } from './dto/convert-product-service-telecom.dto';
import { Response } from 'express';
import { ERROR } from 'src/shares/message/excel.message';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';
import { convertEnumToString } from 'src/shares/helpers/utils';

export enum TypeInputExcel {
  month = 'Gia hạn',
  full = 'Thanh toán một lần',
}

@Injectable()
export class ExcelProductServiceTelecomService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private excelService: ExcelService,
  ) {}

  async importProductServiceTelecomExcel(file: Express.Multer.File, res: Response, create_by: string): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const dataInput = this.excelService.formatDataFileInput(workbook);
    const { errorInfo, validProductService } = await this.filterDataProduct(dataInput, create_by);

    // create product service telecom
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
    const dataInputConvert = this.convertDataProductExcel(data?.slice(2), product_service_type_name, key_field_name);
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

        // convert contract_id
        const contract_id = (await this.excelService.findContractByName(_?.contract_name))?.['_id'];
        // validate contract_id
        if (!_?.contract_name) {
          descError.push(ERROR.CONTRACT_NOT_FOUND);
        } else if (!contract_id) {
          descError.push(ERROR.CONTRACT_NOT_FOUND_IN_DB);
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

        // convert buy_type
        const buy_type = this.excelService.getBuyTypeServiceInfo(_?.buy_type_input);
        // validate buy_type
        if (!_?.buy_type_input) {
          descError.push(ERROR.BUY_TYPE_NOT_FOUND);
        }
        if (!buy_type) {
          descError.push(ERROR.BUY_TYPE_NOT_MATCH + convertEnumToString(TypeInputExcel));
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

        // convert capacity_id
        const capacity_id = (await this.excelService.findCapacityByName(_?.capacity_name))?.['_id'];
        // validate capacity_id
        if (!_?.capacity_name) {
          descError.push(ERROR.CAPACITY_NOT_FOUND);
        } else if (!capacity_id) {
          descError.push(ERROR.CAPACITY_NOT_FOUND_IN_DB);
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

        // convert buying_fee  unit_id
        const buying_fee_unit_id = (await this.excelService.findUnitByName(_?.buying_fee?.unit_name))?.['_id'];
        // validate buying_fee  unit_id
        if (!_?.buying_fee?.unit_name) {
          descError.push(ERROR.BUYING_FEE_UNIT_ID_NOT_FOUND);
        }
        if (!buying_fee_unit_id) {
          descError.push(ERROR.BUYING_FEE_UNIT_ID_NOT_FOUND_IN_DB);
        }

        // convert service_info_id
        const service_info_id = (await this.excelService.findServiceInfoByCode(_?.code))?.['_id'];
        // validate service_info_id
        if (!_?.code) {
          descError.push(ERROR.CODE_NOT_FOUND);
        }
        if (!service_info_id) {
          descError.push(ERROR.CODE_SERVICE_NOT_FOUND_IN_DB);
        }

        if (!_?.buying_fee?.unit_name) {
          descError.push(ERROR.UNIT_NOT_FOUND);
        } else if (!buying_fee_unit_id) {
          descError.push(ERROR.UNIT_NOT_FOUND_IN_DB);
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

        // convert contract_expire_date
        const { error: error_contract_expire_date, date: contract_expire_date } = this.excelService.convertToDate(
          _?.contract_expire_date,
          'ngày hết hạn hợp đồng',
        );
        // validate contract_expire_date
        if (error_contract_expire_date.length > 0) {
          descError.push(...error_contract_expire_date);
        }

        // convert active_date
        const { error: error_active_date, date: active_date } = this.excelService.convertToDate(
          _?.active_date,
          'ngày bắt đầu tính cước',
        );
        // validate active_date
        if (error_active_date.length > 0) {
          descError.push(...error_active_date);
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
          productServiceValid.import_date = import_date;
          productServiceValid.contract_expire_date = contract_expire_date;
          productServiceValid.active_date = active_date;
          productServiceValid.inactive_date = inactive_date;
          productServiceValid.currency_unit_id = currency_unit_id.toString();
          productServiceValid.buying_fee.unit_id = buying_fee_unit_id?.toString();
          productServiceValid.supplier_id = supplier_id.toString();
          productServiceValid.service_info_id = service_info_id.toString();
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
  ): ConvertProductServiceTelecomDto[] {
    return data.map((_) => {
      return {
        product_type_name: product_type_name?.trim(),
        ID: _[`${key_field_name}`]?.toString()?.trim(),
        imei: _?.__EMPTY?.toString().trim(),
        iccid: _?.__EMPTY_1?.toString(),
        code: _?.__EMPTY_2,
        supplier_name: _?.__EMPTY_4,
        service_name: _?.__EMPTY_5,
        buy_type_input: _?.__EMPTY_6,
        service_group_name: _?.__EMPTY_7,
        capacity_name: _?.__EMPTY_8,
        contract_name: _?.__EMPTY_9,
        import_date: _?.__EMPTY_10,
        contract_expire_date: _?.__EMPTY_11,
        producer_name: _?.__EMPTY_12,
        currency_unit_name: _?.__EMPTY_13,
        buying_info: {
          deposit: _?.__EMPTY_14,
          total: _?.__EMPTY_15,
        },
        saihakko_fee: _?.__EMPTY_16,
        buying_fee: {
          price: _?.__EMPTY_17,
          unit_name: _?.__EMPTY_18,
        },
        active_date: _?.__EMPTY_19,
        status_input: _?.__EMPTY_20,
        inactive_date: _?.__EMPTY_21,
        desc: _?.__EMPTY_22,
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
