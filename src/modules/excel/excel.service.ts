import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as xlsx from 'xlsx';
import * as Excel from 'exceljs';

import { InfoExcelConvertDto } from './dto/info-excel-convert.dto';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema';

import { Type, TypeDocument } from '../type/schemas/type.schema';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { Capacity } from '../capacity/schemas/capacity.schema';
import { Contract, ContractDocument } from '../contract/schema/contracts.schema';
import { TypeUse, TypeUseDocument } from '../type-use/schemas/type-use.schema';
import { Producer, ProducerDocument } from '../producer/schemas/producer.schema';
import { ProductInfo, ProductInfoDocument } from '../product-info/schemas/product-info.schema';
import { ERROR } from 'src/shares/message/excel.message';
import { ExchangeTypeConvert } from 'src/shares/enums/exchange.enum';
import { Client, ClientDocument } from '../client/schemas/client.schema';
import { Device, DeviceDocument } from '../device/schemas/device.schema';
import { ShippingMethod, ShippingMethodDocument } from '../shipping-method/schemas/shipping-method.schema';

export enum TypeInputExcel {
  month = 'Gia hạn',
  full = 'Thanh toán một lần',
}

@Injectable()
export class ExcelService {
  constructor(
    @InjectModel(Type.name) private typeModel: Model<TypeDocument>,
    @InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>,
    @InjectModel(Group.name) private GroupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(Capacity.name) private capacityModel: Model<Capacity>,
    @InjectModel(Contract.name) private contractModel: Model<ContractDocument>,
    @InjectModel(TypeUse.name) private typeUserModel: Model<TypeUseDocument>,
    @InjectModel(Producer.name) private producerModel: Model<ProducerDocument>,
    @InjectModel(ProductInfo.name) private productInfoModel: Model<ProductInfoDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(ShippingMethod.name) private shippingMethodModel: Model<ShippingMethodDocument>,
  ) {}

  async exportToExcel(data: any[], res: Response, nameFile: string): Promise<void> {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    data.forEach((item) => {
      const row = [];
      headers.forEach((header) => {
        row.push(item[header]);
      });
      worksheet.addRow(row);
    });

    // const buffer = await workbook.xlsx.writeBuffer();

    // res.set({
    //   'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   'Content-Disposition': `attachment; filename=${nameFile}.xlsx`,
    // });

    // res.send({ buffer: buffer });

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${nameFile}.xlsx`,
    });
    await workbook.xlsx.write(res);
    res.end();
  }

  getExcelInfo(workbook: xlsx.WorkBook, dataExcelFormatError: any): any {
    const sheet = xlsx.utils.json_to_sheet(dataExcelFormatError);
    xlsx.utils.book_append_sheet(workbook, sheet, `${new Date().getTime()}`);

    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  formatDataError(workbook: xlsx.WorkBook, errorInfo: any[]): any {
    const dataExcelFormatError = [];
    workbook.SheetNames.forEach((sheetName: string) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      errorInfo.forEach((error: any) => {
        const rowData = jsonData[error.row - 1];
        const newRowData = ['', 'false', error.info, JSON.stringify(error.desc)];

        newRowData.forEach((value, index) => {
          const key = '__EMPTY_31'[index];
          rowData[key] = value;
        });
      });
      dataExcelFormatError.push(...jsonData);
    });
    return dataExcelFormatError;
  }

  formatDataFileInput(workbook: xlsx.WorkBook): InfoExcelConvertDto[] {
    const data: InfoExcelConvertDto[] = [];

    workbook?.SheetNames?.forEach((sheetName: string) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { raw: false });

      jsonData?.forEach((row: any, rowIndex: number) => {
        data.push({ ...row, row: rowIndex + 1 });
      });
    });

    return data;
  }

  formatString(input: string): string {
    return input?.toString().toLowerCase().trim();
  }

  isEmptyObject(obj): boolean {
    return JSON.stringify(obj) === '{}';
  }

  formatOtherFees(input: string): any {
    const sections = input?.split('-')?.map((section) => section.trim());
    const result = [];

    sections?.forEach((section) => {
      const [name, price] = section?.split(':')?.map((part) => part.trim());
      result.push({ name, price: Number(price) });
    });

    return result;
  }

  formatServiceCharges(input: string): any {
    const sections = input?.split('-')?.map((section) => section.trim());
    const result = [];

    sections?.forEach((section) => {
      const [name, value] = section?.split(':')?.map((part) => part.trim());
      result.push({ name, value: Number(value) });
    });

    return result;
  }

  formatAttributes(input: string): any {
    const sections = input?.split('-')?.map((section) => section?.trim());
    const result = [];

    sections?.forEach((section) => {
      const [name, value] = section?.split(':')?.map((part) => part?.trim());
      result.push({ name, value });
    });

    return result;
  }

  getKeyByValue(object: any, value: string): string | null {
    return Object.keys(object).find((key) => object[key] === value) || null;
  }

  getBuyTypeServiceInfo(buyType: string): string | null {
    const buyTypeInput = this.formatString(buyType);
    const BuyType = { full: 'thanh toán một lần', monthly: 'gia hạn' };
    if (Object.values(BuyType).includes(buyTypeInput)) {
      return this.getKeyByValue(BuyType, buyTypeInput);
    }
    return null;
  }

  getStatusServiceInfo(status: string): string | null {
    const statusConvert = this.formatString(status);
    const statusEnum = { ACTIVE: 'hoạt động', INACTIVE: 'không hoạt động' };
    if (Object.values(statusEnum).includes(statusConvert)) {
      return this.getKeyByValue(statusEnum, statusConvert);
    }
    return null;
  }

  convertSymbolToValue(symbol: string): number | null {
    const convertObject = ExchangeTypeConvert.find((item) => item.symbol === symbol);
    return convertObject ? convertObject.value : null;
  }

  formatSellingExchangesFees(
    input: string,
  ): {
    selling_exchanges_format: { price: number; exchange_type_symbol: string; quantity: number; unit_name: string }[];
    listError: string[];
  } {
    const listError = [];
    const parts = input.split('-')?.map((part) => part?.trim());

    const selling_exchanges_format = parts?.map((part, index) => {
      const [price, exchange_quantity_unit] = part?.split('|')?.map((item) => item?.trim());
      let exchange_type_symbol;
      let quantity;
      let unit_name;
      if (exchange_quantity_unit) {
        [exchange_type_symbol, quantity, unit_name] = exchange_quantity_unit?.split(' ');
      }

      const validPrice = this.isNumber(Number(price));
      const validExchangeTypeSymbol = this.isString(exchange_type_symbol);
      const validQuantity = this.isNumber(Number(quantity));
      const validUnitName = this.isString(unit_name);

      // check field exit
      if (price && exchange_type_symbol && quantity && unit_name) {
        if (validPrice && validExchangeTypeSymbol && validQuantity && validUnitName) {
          return {
            price: Number(price),
            exchange_type_symbol: exchange_type_symbol?.trim(),
            quantity: Number(quantity),
            unit_name: unit_name.trim(),
          };
        } else {
          listError.push(`phần tử trong quy đổi giá bán không đúng kiểu dữ liệu: phần tử thứ: ` + (index + 1));
        }
      } else {
        listError.push(`phần tử quy đổi giá bán không đủ dữ liệu: phần tử thứ: ` + (index + 1));
        return;
      }
    });

    return { selling_exchanges_format, listError };
  }

  // Helper Functions
  isValidTypeService(data: InfoExcelConvertDto[]): boolean {
    return Object.keys(data[0])[0] && !Object.keys(data[0])[0]?.includes('__EMPTY');
  }

  getTypeAndKeyName(data: InfoExcelConvertDto[]): string {
    return Object.keys(data[0])[0];
  }

  async getTypeByName(keyNameAndTypeService: string): Promise<Type> {
    if (!keyNameAndTypeService) return null;

    console.log(keyNameAndTypeService);

    return this.typeModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, this.formatString(keyNameAndTypeService)] },
      })
      .exec();
  }

  // todo:  change function in module

  async findGroupByName(groupName: string): Promise<Group> {
    if (!groupName) return null;

    return this.GroupModel.findOne({
      $expr: { $eq: [{ $toLower: '$name' }, this.formatString(groupName)] },
    }).exec();
  }

  async findCapacityByName(capacityName: string): Promise<Capacity> {
    if (!capacityName) return null;

    return this.capacityModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, this.formatString(capacityName)] },
      })
      .exec();
  }

  async findContractByName(contractName: string): Promise<Contract> {
    if (!contractName) return null;

    return this.contractModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, this.formatString(contractName)] },
      })
      .exec();
  }
  async findClient(query: any): Promise<any> {
    return this.contractModel.findOne({ query }).select('_id').exec();
  }

  async findDevice(query: any): Promise<any> {
    return this.deviceModel.findOne({ query }).select('_id').exec();
  }
  async findShippingMethod(query: any): Promise<any> {
    return this.shippingMethodModel.findOne({ query }).select('_id').exec();
  }

  async findServiceInfo(query: any): Promise<any> {
    return this.serviceInfoModel.findOne({ query }).select('_id').exec();
  }

  async findTypeUseByName(typeServiceUseName: string): Promise<TypeUse> {
    if (!typeServiceUseName) return null;

    return this.typeUserModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, this.formatString(typeServiceUseName)] },
      })
      .exec();
  }

  async findCurrencyUnitByName(currencyUnitName: string): Promise<Unit> {
    if (!currencyUnitName) return null;

    return this.unitModel
      .findOne({
        $expr: { $eq: [{ $toLower: '$name' }, this.formatString(currencyUnitName)] },
      })
      .exec();
  }

  async findProducerByName(producerName: string): Promise<Producer> {
    if (!producerName) return null;

    return this.producerModel.findOne({
      $expr: { $eq: [{ $toLower: '$name' }, this.formatString(producerName)] },
    });
  }

  async findUnitByName(unitName: string): Promise<Unit> {
    if (!unitName) return null;

    return this.unitModel.findOne({
      $expr: { $eq: [{ $toLower: '$name' }, this.formatString(unitName)] },
    });
  }

  async findServiceInfoByCode(code: string): Promise<Unit> {
    if (!code) return null;

    return this.serviceInfoModel.findOne({
      $expr: { $eq: [{ $toLower: '$code' }, this.formatString(code)] },
    });
  }

  async findProductInfoByCode(code: string): Promise<Unit> {
    if (!code) return null;

    return this.productInfoModel.findOne({
      $expr: { $eq: [{ $toLower: '$code' }, this.formatString(code)] },
    });
  }

  isString(input) {
    return typeof input === 'string';
  }

  isNumber(input) {
    return typeof input === 'number' && !isNaN(input);
  }

  convertToDate(dateString: string, fieldName?: string): { date: Date; error: string[] } {
    const error: string[] = [];
    let date;
    if (!dateString) {
      error.push(fieldName + ERROR.DATE_IS_EMPTY);
    } else {
      const parts = dateString?.split('/');
      if (parts[0] && parts[1] && parts[2]) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        date = new Date(year, month, day);
      } else {
        error.push(fieldName + ERROR.DATE_INVALID);
      }
    }

    return { error, date };
  }
}
