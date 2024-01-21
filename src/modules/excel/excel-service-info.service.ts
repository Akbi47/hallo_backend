import { BadRequestException, Injectable } from '@nestjs/common'

import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import * as xlsx from 'xlsx'
import { ExcelService, TypeInputExcel } from './excel.service'
import { InfoExcelConvertDto } from './dto/info-excel-convert.dto'
import { CreateErrorInfoDto } from './dto/error-info.dto'
import { Response } from 'express'
import { ERROR } from 'src/shares/message/excel.message'
import { ServiceInfo, ServiceInfoDocument } from '../service-info/schemas/service-info.schema'
import { ServiceInfoStatus } from 'src/shares/enums/service-info.enum'
import { ConvertServiceInfoInputDto } from './dto/convert-service-info.dto'
import { convertEnumToString } from 'src/shares/helpers/utils'

@Injectable()
export class ExcelServiceInfoService {
  constructor(@InjectModel(ServiceInfo.name) private serviceInfoModel: Model<ServiceInfoDocument>, private excelService: ExcelService) {}

  async importServiceInfoExcel(file: Express.Multer.File, res: Response, create_by: string): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' })
    const dataInput = this.excelService.formatDataFileInput(workbook)
    const { errorInfo, validService } = await this.filterDataServiceInfo(dataInput, create_by)

    // create service
    await this.serviceInfoModel.create(validService)

    // send file check error
    if (errorInfo.length > 0) {
      const dataExcelFormatError = this.excelService.formatDataError(workbook, errorInfo)
      const excelBuffer = this.excelService.getExcelInfo(workbook, dataExcelFormatError)
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=example.xlsx',
      })
      res.send({ buffer: excelBuffer })
    } else {
      res.send()
    }
  }

  async filterDataServiceInfo(
    data: InfoExcelConvertDto[],
    create_by: string
  ): Promise<{ errorInfo: CreateErrorInfoDto[]; validService: ServiceInfo[] }> {
    const errorInfo: CreateErrorInfoDto[] = []
    const validService: ServiceInfo[] = []

    if (!this.excelService.isValidTypeService(data)) {
      throw new BadRequestException()
    }

    const service_type_name = this.excelService.getTypeAndKeyName(data)
    const key_field_name = this.excelService.getTypeAndKeyName(data)

    const dataInputConvert = this.convertDataServiceInfoExcel(data.slice(2), service_type_name, key_field_name)

    await Promise.all(
      dataInputConvert.map(async (_) => {
        const descError: string[] = []

        // convert type service info
        const type_service_id = (await this.excelService.getTypeByName(service_type_name))?.['_id']

        // validate type service info
        if (!type_service_id) {
          descError.push(ERROR.TYPE_SERVICE_NOT_FOUND)
        } else if (!type_service_id) {
          descError.push(ERROR.TYPE_SERVICE_NOT_FOUND_IN_DB)
        }

        // validate name service info
        if (!_.name) {
          descError.push(ERROR.NAME_SERVICE_NOT_FOUND)
        }

        // convert buy_type
        const buy_type = this.excelService.getBuyTypeServiceInfo(_?.buy_type_input)
        // validate buy_type
        if (!_?.buy_type_input) {
          descError.push(ERROR.BUY_TYPE_NOT_FOUND)
        }
        if (!buy_type) {
          descError.push(ERROR.BUY_TYPE_NOT_MATCH + convertEnumToString(TypeInputExcel))
        }

        // convert service_group_id
        const service_group_id = (await this.excelService.findGroupByName(_?.service_group_name))?.['_id']
        // validate service_group_id
        if (!_?.service_group_name) {
          descError.push(ERROR.SERVICE_GROUP_NOT_FOUND)
        }
        if (!service_group_id) {
          descError.push(ERROR.SERVICE_GROUP_NOT_FOUND_IN_DB)
        }

        // convert type_service_use_id
        const type_service_use_id = (await this.excelService.findTypeUseByName(_?.type_service_use_name))?.['_id']
        // validate type_service_use_id
        if (!_?.type_service_use_name) {
          descError.push(ERROR.TYPE_SERVICE_USE_NOT_FOUND)
        } else if (!type_service_use_id) {
          descError.push(ERROR.TYPE_SERVICE_USE_NOT_FOUND_IN_DB)
        }

        // convert currency_unit_id
        const currency_unit_id = (await this.excelService.findCurrencyUnitByName(_?.currency_unit_name))?.['_id']
        // validate currency_unit_id
        if (!_?.currency_unit_name) {
          descError.push(ERROR.CURRENCY_UNIT_NOT_FOUND)
        } else if (!currency_unit_id) {
          descError.push(ERROR.CURRENCY_UNIT_NOT_FOUND_IN_DB)
        }

        // convert unit_id
        const unit_id = (await this.excelService.findCurrencyUnitByName(_?.currency_unit_name))?.['_id']
        // validate unit_id
        if (!_?.currency_unit_name) {
          descError.push(ERROR.UNIT_NOT_FOUND)
        } else if (!unit_id) {
          descError.push(ERROR.UNIT_NOT_FOUND_IN_DB)
        }

        // convert producer_id
        const producer_id = (await this.excelService.findProducerByName(_?.producer_info?.producer_name))?.['_id']
        // validate producer
        if (!_?.producer_info?.producer_name) {
          descError.push(ERROR.PRODUCER_USE_NOT_FOUND)
        }
        if (!producer_id) {
          descError.push(ERROR.PRODUCER_USE_NOT_FOUND_IN_DB)
        }

        // convert selling_fee unit_id
        const selling_fee_unit_id = (await this.excelService.findUnitByName(_?.selling_fee?.unit_name))?.['_id']
        // validate selling_fee unit_id
        if (!_?.selling_fee?.unit_name) {
          descError.push(ERROR.UNIT_NOT_FOUND)
        }
        if (!selling_fee_unit_id) {
          descError.push(ERROR.UNIT_NOT_FOUND_IN_DB)
        }

        // convert status
        const status = this.excelService.getStatusServiceInfo(_?.status_input)
        // validate status
        if (!_?.status_input) {
          descError.push(ERROR.STATUS_NOT_FOUND)
        }
        if (!status) {
          descError.push(ERROR.STATUS_INVALID)
        }

        const attributes = this.excelService.formatAttributes(_?.attributes_input)

        const service_charges = this.formatServiceCharges(_?.service_charges_input)

        let selling_exchanges = []
        const { selling_exchanges_format, listError } = this.excelService.formatSellingExchangesFees(_?.selling_exchanges_input)
        if (listError.length > 0) {
          descError.push(...listError)
        } else {
          selling_exchanges = await Promise.all(
            selling_exchanges_format.map(async (sx) => {
              const { price, exchange_type_symbol, quantity, unit_name } = sx
              const unit_id = (await this.excelService.findUnitByName(unit_name))?.['_id']
              const exchange_type = this.excelService.convertSymbolToValue(exchange_type_symbol)

              // valid unit_id
              if (!unit_id) {
                descError.push(ERROR.SELLING_EXCHANGES_UNIT_NOT_FOUND_IN_DB)
              }

              if (exchange_type === null) {
                descError.push(ERROR.SELLING_EXCHANGES_TYPE_INVALID)
              }

              if (price && exchange_type && quantity && unit_id) {
                return { price, exchange_type, quantity, unit_id: unit_id.toString() }
              } else {
                descError.push(ERROR.SELLING_EXCHANGES_INVALID)
                return
              }
            })
          )
        }

        if (descError.length > 0) {
          errorInfo.push({
            desc: descError,
            info: _[key_field_name],
            row: _?.row,
          })
        } else {
          const serviceInfoValid: any = _
          serviceInfoValid.type_service_id = type_service_id.toString()
          serviceInfoValid.buy_type = buy_type
          serviceInfoValid.service_group_id = service_group_id.toString()
          serviceInfoValid.type_service_use_id = type_service_use_id.toString()
          serviceInfoValid.attributes = attributes || []
          serviceInfoValid.currency_unit_id = currency_unit_id.toString()
          serviceInfoValid.service_charges = service_charges
          serviceInfoValid.selling_exchanges = selling_exchanges
          serviceInfoValid.producer_info.producer_id = producer_id.toString()
          serviceInfoValid.selling_fee.unit_id = selling_fee_unit_id.toString()
          serviceInfoValid.status = status as ServiceInfoStatus
          const data: ServiceInfo = serviceInfoValid
          ;(serviceInfoValid.histories = [{ create_by, info: JSON.stringify(serviceInfoValid), created_at: new Date() }]), validService.push(data)
        }
      })
    )

    return {
      errorInfo,
      validService,
    }
  }

  convertDataServiceInfoExcel(data: InfoExcelConvertDto[], name_service: string, key_field_name: string): ConvertServiceInfoInputDto[] {
    return data.map((_) => {
      return {
        code: _?.__EMPTY?.trim(),
        type_service_name: _[`${key_field_name}`]?.trim(),
        name: name_service?.trim(),
        buy_type_input: _?.__EMPTY_2,
        service_group_name: _?.__EMPTY_3?.trim(),
        type_service_use_name: _?.__EMPTY_4?.trim(),
        unit_name: _?.__EMPTY_5?.trim(),
        attributes_input: _?.__EMPTY_6?.trim(),
        currency_unit_name: _?.__EMPTY_7?.trim(),
        service_charges_input: _?.__EMPTY_8?.trim(),
        desc: _?.__EMPTY_9?.trim(),
        producer_info: {
          producer_name: _?.__EMPTY_10?.trim(),
          service_production_location: _?.__EMPTY_11?.trim(),
        },
        selling_exchanges_input: _?.__EMPTY_12?.trim(),
        default_selling_price: _?.__EMPTY_13?.trim(),
        selling_fee: {
          price: _?.__EMPTY_14,
          unit_name: _?.__EMPTY_15,
        },
        status_input: _?.__EMPTY_16,
        row: _?.row,
      }
    })
  }

  formatServiceCharges(input: string): any {
    const sections = input?.split('-')?.map((section) => section.trim())
    const result = []

    sections?.forEach((section) => {
      const [name, price] = section?.split(':')?.map((part) => part.trim())
      result.push({ name, price: Number(price) })
    })

    return result
  }
}
