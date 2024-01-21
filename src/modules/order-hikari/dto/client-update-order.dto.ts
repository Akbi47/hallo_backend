import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator'
import { HikariLanguageEnum, StatusEnum, TimeContactEnum, TypeContractEnum } from 'src/shares/enums/hikari.enum'

export class UpdateOrderHiakriDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  _id?: string

  @ApiProperty({ required: false })
  @IsMongoId()
  user_id: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  client_id?: string

  @ApiProperty({ required: false })
  @IsOptional()
  client?: any

  @ApiProperty({ required: false })
  @IsMongoId()
  sub_service_id: string

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  cost: number

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  deleted: boolean

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  cost_first_month: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  note: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  code_contract: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  address: string

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  progress_file: number

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  method_payment: number

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  setup_time: number

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  support_setup: boolean

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  device_tp_link: number

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  wifi_temp: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  code_wifi_temp: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  code_letters: string

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly setup_date?: Date

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly send_date_temp?: Date

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly used_date_temp?: Date

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly pay_date_temp?: Date

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly up_file_date?: Date

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  cancel_reason: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  another_cancel_reason: string

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  cancel_file_reason: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  another_cancel_file_reason: string

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  stop_contract: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  another_stop_contract: string

  // @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum

  // @ApiProperty({ required: false, type: HikariLanguageEnum })
  @IsOptional()
  @IsEnum(HikariLanguageEnum)
  language?: HikariLanguageEnum

  // @ApiProperty({ required: false, type: TypeContractEnum })
  @IsOptional()
  @IsEnum(TypeContractEnum)
  type_contract?: TypeContractEnum

  // @ApiProperty({ required: false, type: TimeContactEnum })
  @IsOptional()
  @IsEnum(TimeContactEnum)
  time_contract?: TimeContactEnum
}
