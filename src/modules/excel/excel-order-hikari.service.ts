import { BadRequestException, Injectable } from '@nestjs/common'

import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import * as xlsx from 'xlsx'
import { ExcelService, TypeInputExcel } from './excel.service'
import { InfoExcelConvertDto } from './dto/info-excel-convert.dto'
import { CreateErrorInfoDto } from './dto/error-info.dto'
import { Response } from 'express'
import { ERROR } from 'src/shares/message/excel.message'
import { ServiceInfoStatus } from 'src/shares/enums/service-info.enum'
import { ConvertServiceInfoInputDto } from './dto/convert-service-info.dto'
import { convertEnumToString } from 'src/shares/helpers/utils'
import { OrderHikari, OrderHikariDocument } from '../order-hikari/schemas/order-hikari.schema'
import { Source, SourceDocument } from '../source/schemas/source.schema'
import { Product, ProductDocument } from '../product/schemas/product.schema'
import { Client, ClientDocument } from '../client/schemas/client.schema'
import { SubServiceHikari, SubServiceHikariDocument } from '../sub-service-hikari/schemas/sub-service-hikari.schema'

@Injectable()
export class ExcelOrderHikariService {
  constructor(
    @InjectModel(Source.name) private sourceModel: Model<SourceDocument>,
    @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
    @InjectModel(OrderHikari.name) private orderHikariModel: Model<OrderHikariDocument>,
    @InjectModel(SubServiceHikari.name)
    private subServiceModel: Model<SubServiceHikariDocument>,
    private excelService: ExcelService
  ) {}

  timeContact = [
    { _id: 0, name: '8h - 12h' },
    { _id: 1, name: '12h - 14h' },
    { _id: 2, name: '14h - 16h' },
    { _id: 3, name: '16h - 18h' },
    { _id: 4, name: '18h - 20h' },
    { _id: 5, name: '19h - 21h' },
    { _id: 6, name: '20h - 21h' },
    { _id: 7, name: 'AnyTime' },
  ]

  typeContract = [
    { _id: 0, name: '36 tháng' },
    { _id: 1, name: '24 tháng' },
  ]

  gender = [
    { _id: 0, name: 'Nam' },
    { _id: 1, name: 'Nữ' },
  ]

  async importServiceInfoExcel(file: Express.Multer.File, res: Response, create_by: string): Promise<void> {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    const workbook = xlsx.read(file.buffer, { type: 'buffer' })
    const dataInput = this.excelService.formatDataFileInput(workbook)
    const { errorInfo, validService } = await this.filterDataOrderHikari(dataInput, create_by)

    // create service
    // await this.orderHikariModel.create(validService)

    // send file check error
    // if (errorInfo.length > 0) {
    //   const dataExcelFormatError = this.excelService.formatDataError(workbook, errorInfo)
    //   const excelBuffer = this.excelService.getExcelInfo(workbook, dataExcelFormatError)
    //   res.set({
    //     'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //     'Content-Disposition': 'attachment; filename=example.xlsx',
    //   })
    //   res.send({ buffer: excelBuffer })
    // } else {
    res.send()
    // }
  }

  async filterDataOrderHikari(
    data: InfoExcelConvertDto[],
    create_by: string
  ): Promise<{ errorInfo: CreateErrorInfoDto[]; validService: OrderHikari[] }> {
    const sources = await this.sourceModel.find().lean()

    const errorInfo: CreateErrorInfoDto[] = []
    const validService: OrderHikari[] = []

    if (!this.excelService.isValidTypeService(data)) {
      throw new BadRequestException()
    }

    const service_type_name = this.excelService.getTypeAndKeyName(data)
    const key_field_name = this.excelService.getTypeAndKeyName(data)

    const dataInputConvert = this.convertDataOrderHikariExcel(data.slice(1))

    await Promise.all(
      dataInputConvert.map(async (_) => {
        const descError: string[] = []

        // validate type service info
        // if (!_.address) {
        //   descError.push(ERROR.TYPE_SERVICE_NOT_FOUND)
        // }

        if (descError.length > 0) {
          errorInfo.push({
            desc: descError,
            info: _[key_field_name],
            row: _?.row,
          })
        } else {
          const orderHikariValid: any = {}
          orderHikariValid.address = _.address?.toString()
          orderHikariValid.cost_first_month = _.cost_first_month
          orderHikariValid.time_contact = this.timeContact.find((timeContact: any) => timeContact.name === _.time_contact?.toString())?._id
          orderHikariValid.type_contract = this.typeContract.find((typeContract: any) => typeContract.name === _.type_contract?.toString())?._id
          orderHikariValid.note = _.note?.toString()
          const parts = _.sub_service_id?.split('-')
          const lastPart = parts && parts[parts.length - 1].trim()
          orderHikariValid.sub_service_id = lastPart
          orderHikariValid.status = 0

          const subService: any = await this.subServiceModel
            .find({
              _id: orderHikariValid.sub_service_id,
            })
            .lean()
          orderHikariValid.cost = subService[0]?.cost

          const clientValid: any = {}
          clientValid.birthday = _.birthday?.toString()
          clientValid.full_name = _.full_name?.toString()
          clientValid.japanese_name = _.japanese_name?.toString()
          clientValid.gender = this.gender.find((gender: any) => gender.name === _.gender?.toString())?._id
          clientValid.phone = _.phone?.toString()
          clientValid.pancake = _.pancake?.toString()
          clientValid.method_contact = _.method_contact?.toString()
          clientValid.source_id = sources.find((source: any) => source.name === _.source?.toString())?._id

          const client = await this.clientModel.create({
            ...clientValid,
            code: this.generateCustomerCode('KH_'),
            status: 'ACTIVE',
          })

          await this.orderHikariModel.create({
            ...orderHikariValid,
            code: this.generateCustomerCode('DH_'),
            client_id: client.id,
            user_id: create_by,
          })

          validService.push(orderHikariValid)
        }
      })
    )

    return {
      errorInfo,
      validService,
    }
  }

  convertDataOrderHikariExcel(data: any): any[] {
    return data.map((_) => {
      return {
        japanese_name: _?.__EMPTY?.trim(),
        full_name: _?.__EMPTY_1?.trim(),
        phone: _?.__EMPTY_2?.trim(),
        method_contact: _?.__EMPTY_3?.trim(),
        birthday: _?.__EMPTY_4?.trim(),
        address: _?.__EMPTY_5?.trim(),
        source: _?.__EMPTY_6?.trim(),
        gender: _?.__EMPTY_7?.trim(),
        status_mode: _?.__EMPTY_11?.trim(),
        time_contact: _?.__EMPTY_12?.trim(),
        type_contract: _?.__EMPTY_13?.trim(),
        sub_service_id: _?.__EMPTY_14?.trim(),
        cost_first_month: _?.__EMPTY_15?.trim(),
        note: _?.__EMPTY_16?.trim(),
        pancake: _?.Hikari?.trim(),
        row: _?.row,
      }
    })
  }

  generateCustomerCode(prefix) {
    const randomNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0')
    const customerCode = prefix + randomNumber
    return customerCode
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
