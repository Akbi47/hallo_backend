import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator'
import { HikariLanguageEnum, TimeContactEnum, TypeContractEnum } from 'src/shares/enums/hikari.enum'

export class CreateOrderHiakriDto {
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

  // @ApiProperty({ required: false })
  // @IsMongoId()
  // sub_service_id: string

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  cost: number

  // @ApiProperty({ required: false, type: Number })
  // @IsNumber()
  // cost_first_month: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  note: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  address: string

  // @ApiProperty({ required: false, type: String })
  // @IsString()
  // status: string

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
