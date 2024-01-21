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
import { Supplier, SupplierDocument } from '../supplier/schemas/supplier.schema';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';

export enum TypeInputExcel {
  month = 'Gia hạn',
  full = 'Thanh toán một lần',
}

@Injectable()
export class ExcelSupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    private excelService: ExcelService,
  ) {}

  async importSupplierByExcel(file: Express.Multer.File, res: Response, create_by: string): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const dataInput = this.excelService.formatDataFileInput(workbook);
    const { errorInfo, validSuppliers } = await this.filterDataSupplier(dataInput, create_by);

    // create product service
    await this.supplierModel.create(validSuppliers);

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

  async filterDataSupplier(
    data: InfoExcelConvertDto[],
    create_by: string,
  ): Promise<{ errorInfo: CreateErrorInfoDto[]; validSuppliers: Supplier[] }> {
    const errorInfo: CreateErrorInfoDto[] = [];
    const validSuppliers: Supplier[] = [];

    if (!this.excelService.isValidTypeService(data)) {
      throw new BadRequestException();
    }

    const dataInputConvert = this.convertDataSupplier(data?.slice(2));

    await Promise.all(
      dataInputConvert.map(async (_) => {
        const descError: string[] = [];
        // convert type_id
        const type_id = (await this.excelService.getTypeByName(_?.type_name))?.['id'];
        // validate type_id
        if (!_?.type_name) {
          descError.push(ERROR.TYPE_NOT_FOUND);
        }
        if (!type_id) {
          descError.push(ERROR.TYPE_NOT_IN_DB);
        }

        // convert status
        const status = this.getStatusSupplier(_?.status_input);
        // validate status
        if (!_?.status_input) {
          descError.push(ERROR.STATUS_NOT_FOUND);
        }
        if (!status) {
          descError.push(ERROR.STATUS_INVALID);
        }

        if (descError.length > 0) {
          errorInfo.push({
            desc: descError,
            info: _.name,
            row: _?.row,
          });
        } else {
          const supplierValid: any = _;
          supplierValid.type_id = type_id;
          supplierValid.status = status.toString() as ProductStatusEnum;
          const data: Supplier = supplierValid;

          (supplierValid.histories = [{ create_by, info: JSON.stringify(supplierValid), created_at: new Date() }]),
            validSuppliers.push(data);
        }
      }),
    );

    return {
      errorInfo,
      validSuppliers,
    };
  }

  convertDataSupplier(
    data: InfoExcelConvertDto[],
  ): {
    name: string;
    type_name: string;
    desc: string;
    status_input: string;
    row: number;
  }[] {
    return data.map((_) => {
      return {
        name: _?.['Tên Nhà cung cấp'],
        type_name: _?.['Loại Sản phẩm - Dịch vụ'],
        desc: _?.['Ghi chú'],
        status_input: _?.['Trạng thái'],
        row: _?.row,
      };
    });
  }

  getStatusSupplier(status: string): string | null {
    const statusConvert = this.excelService.formatString(status);
    const statusEnum = {
      ACTIVE: 'hoạt động',
      INACTIVE: 'không hoạt động',
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
