import { BadRequestException, Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import * as xlsx from 'xlsx';
// import * as Excel from 'exceljs';
import { ExcelService } from './excel.service';
import { InfoExcelConvertDto } from './dto/info-excel-convert.dto';
// import { CreateErrorInfoDto } from './dto/error-info.dto';
import { Response } from 'express';
import { ERROR } from 'src/shares/message/excel.message';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { OrderPaymentMethod } from 'src/shares/enums/order.enum';

export enum TypeInputExcel {
  month = 'Gia hạn',
  full = 'Thanh toán một lần',
}

@Injectable()
export class ExcelOrderService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>, private excelService: ExcelService) {}

  async importOrderServiceExcel(file: Express.Multer.File, res: Response, create_by: string): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const dataInput = this.excelService.formatDataFileInput(workbook);
    const { errorInfo, validProductService } = await this.filterDataProduct(dataInput, create_by);
    const resultArray = [];
    validProductService.forEach((inputObj) => {
      if (!inputObj.client_id) {
        if (resultArray.length > 0) {
          const previousObj = resultArray[resultArray.length - 1];
          previousObj.product_order_line.push({
            product_id: inputObj.service_info_id,
            device_id: inputObj.device_id,
            monthly_fee: inputObj.monthly_fee,
            first_month_fee: inputObj.first_month_fee,
            next_month_fee: inputObj.next_month_fee,
            initial_fee: inputObj.initial_fee,
            surcharge: inputObj.surcharge,
            deduction: inputObj.deduction,
            extend_to: inputObj.extend_to,
          });
        }
      } else {
        const { client_id } = inputObj;
        resultArray.push({
          client_id,
          product_order_line: [
            {
              product_id: inputObj?.service_info_id,
              device_id: inputObj?.device_id,
              monthly_fee: inputObj.monthly_fee,
              first_month_fee: inputObj.first_month_fee,
              next_month_fee: inputObj.next_month_fee,
              initial_fee: inputObj.initial_fee,
              surcharge: inputObj.surcharge,
              deduction: inputObj.deduction,
              extend_to: inputObj.extend_to,
            },
          ],
          link_pancake: inputObj.link_pancake,
          zip_code: inputObj.zip_code,
          payment_method: inputObj.payment_method,
          promotions: inputObj.promotions,
          promotion_quantity: inputObj.promotion_quantity,
          delivery_date: inputObj.delivery_date,
          shipping_method_id: inputObj?.shipping_method_id || null,
          // link_pancake: inputObj.link_pancake,
        });
      }
    });

    // send file check error
    if (errorInfo.length > 0) {
      // const errorInfoFormat = [];
      // const rowMap = {};
      // errorInfo.forEach((item) => {
      //   const { row, ...rest } = item;
      //   if (!rowMap[row]) {
      //     rowMap[row] = { ...rest, desc: item.desc };
      //   } else {
      //     rowMap[row].desc.push(...item.desc);
      //   }
      // });
      // for (const row in rowMap) {
      //   errorInfoFormat.push({ ...rowMap[row], row: parseInt(row) });
      // }

      console.log('errorInfoFormat', errorInfo);
      const dataExcelFormatError = this.excelService.formatDataError(workbook, errorInfo);
      const excelBuffer = this.excelService.getExcelInfo(workbook, dataExcelFormatError);

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=example.xlsx',
      });
      res.send(excelBuffer); // Send the Excel buffer directly
      // res.send({ buffer: excelBuffer });
    } else {
      // console.log('resultArray', resultArray);
      // create order
      // console.log(validProductService[0].client_id);
      await this.orderModel.create(resultArray);
      res.send();
    }
  }

  async filterDataProduct(data: any[], create_by: string): Promise<{ errorInfo: any[]; validProductService: any }> {
    const errorInfo: any[] = [];
    let validProductService: any = [];
    // const validProductService: Product[] = [];

    if (!this.excelService.isValidTypeService(data)) {
      throw new BadRequestException();
    }

    const product_service_type_name = this.excelService.getTypeAndKeyName(data);
    console.log(create_by);
    const dataInputConvert = this.convertDataProductExcel(data?.slice(1), product_service_type_name);
    // console.log('dataInputConvert', dataInputConvert);
    validProductService = await Promise.all(
      dataInputConvert.map(async (e) => {
        const descError: string[] = [];
        const orderValid: any = e;
        // convert contract_id
        let client_id;
        if (e?.client_name || e?.client_name_jp || e?.client_email) {
          const query: any = {};
          if (e?.client_name) {
            query.name = e?.client_name;
          }
          if (e?.client_name_jp) {
            query.japanese_name = e?.client_name_jp;
          }

          if (e?.client_email) {
            query.email = e?.email;
          }
          client_id = await this.excelService.findClient(query);
          if (!client_id) {
            descError.push(ERROR.CONTRACT_NOT_FOUND_IN_DB);
          }
        }
        let device_id;
        if (e?.device_name) {
          device_id = await this.excelService.findDevice({ name: e?.device_name });
          if (!client_id) {
            descError.push(ERROR.DEVICE_NOT_FOUND_IN_DB);
          }
        }
        let shipping_method_id;
        if (e?.shipping_method) {
          shipping_method_id = await this.excelService.findShippingMethod({ name: e?.shipping_method });
          if (!shipping_method_id) {
            descError.push(ERROR.SHIPPING_METHOD_NOT_FOUND_IN_DB);
          }
        }

        if (e?.payment_method && !this.isPaymentMethodValid(e?.payment_method)) {
          descError.push(ERROR.PAYMENT_METHOD_NOT_VALID);
        }
        if (!e?.contract_name) {
          descError.push(ERROR.CONTRACT_NOT_FOUND);
        }
        const contract_id = await this.excelService.findContractByName(e?.contract_name);
        // validate contract_id
        if (!contract_id) {
          descError.push(ERROR.CLIENT_NOT_FOUND_IN_DB);
        }
        if (!e?.service_name) {
          descError.push(ERROR.SERVICE_NOT_FOUND);
        }
        const service_info_id = await this.excelService.findServiceInfo({
          name: e?.service_name,
          contract_id: contract_id,
        });
        // validate  product , service
        if (!service_info_id) {
          descError.push(ERROR.PRODUCT_NOT_FOUND_IN_DB);
        }

        // // convert import_date
        const { error: error_import_date } = this.excelService.convertToDate(e?.extend_to, 'Gia hạn đến tháng');
        // validate import_date
        if (e?.extend_to && error_import_date.length > 0) {
          descError.push(...error_import_date);
        }

        // convert contract_expire_date
        const { error: error_contract_expire_date } = this.excelService.convertToDate(e?.delivery_date, 'Ngày nhận');
        // validate contract_expire_date
        if (e?.delivery_date && error_contract_expire_date.length > 0) {
          descError.push(...error_contract_expire_date);
        }
        console.log(descError);
        if (descError.length > 0) {
          errorInfo.push({
            desc: descError.toString(),
            row: e?.row,
          });
        }
        orderValid.client_id = client_id?._id;
        orderValid.service_info_id = service_info_id?._id;
        orderValid.device_id = device_id?._id || null;
        orderValid.shipping_method_id = shipping_method_id?._id || null;

        return orderValid;
      }),
    );
    return {
      errorInfo,
      validProductService,
    };
  }
  isPaymentMethodValid(paymentMethod: string): boolean {
    for (const method in OrderPaymentMethod) {
      if (OrderPaymentMethod[method] === paymentMethod) {
        return true;
      }
    }
    return false;
  }

  convertDataProductExcel(data: InfoExcelConvertDto[], product_type_name: string): any[] {
    return data.map((_) => {
      return {
        product_type_name: product_type_name?.trim(),
        link_pancake: _?.__EMPTY?.toString().trim(),
        client_name: _?.__EMPTY_1?.toString(),
        client_name_jp: _?.__EMPTY_2,
        client_email: _?.__EMPTY_3,
        zip_code: _?.__EMPTY_4,
        service_name: _?.__EMPTY_5,
        contract_name: _?.__EMPTY_6,
        device_name: _?.__EMPTY_7,
        monthly_fee: _?.__EMPTY_8,
        first_month_fee: _?.__EMPTY_9,
        next_month_fee: _?.__EMPTY_10,
        extend_to: _?.__EMPTY_11,
        initial_fee: _?.__EMPTY_12,
        surcharge: _?.__EMPTY_13,
        deduction: _?.__EMPTY_14,
        payment_method: _?.__EMPTY_15,
        // promotions: _?.__EMPTY_16, // to do because promotion logic change
        // promotion_quantity: _?.__EMPTY_17,
        delivery_date: _?.__EMPTY_18,
        shipping_method: _?.__EMPTY_19,
        row: _?.row,
      };
    });
  }
}
