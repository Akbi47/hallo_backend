import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsMongoId, IsString, IsOptional, IsDate, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';

export class BuyingInfoDto {
  @ApiProperty({ required: true })
  @IsNumber()
  deposit: number;

  @ApiProperty({ required: true })
  @IsNumber()
  total: number;
}

export class BuyingFeeDto {
  @ApiProperty({ required: true })
  @IsNumber()
  price: number;

  @ApiProperty({ required: true })
  @IsMongoId()
  unit_id: string;
}

export class ServiceChargesDto {
  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  value: string;
}

export class CreateProductDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly ID?: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly desc: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly product_info_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly service_info_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly imei?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly iccid?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly contract_expire_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly active_date?: Date;

  @ApiProperty({ required: true })
  @IsDate()
  readonly import_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  readonly inactive_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  buying_info?: BuyingInfoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  buying_fee?: BuyingFeeDto;

  @ApiProperty({
    required: true,
    type: ServiceChargesDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceChargesDto)
  service_charges?: ServiceChargesDto[];

  @ApiProperty({
    required: false,
    enum: ProductStatusEnum,
  })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status: ProductStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  saihakko_fee: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  supplier_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  unit_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  currency_unit: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumber()
  buying_price: number;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  readonly currency?: string;
}
