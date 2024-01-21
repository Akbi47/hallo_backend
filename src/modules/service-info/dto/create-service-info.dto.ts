import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BuyType } from 'src/shares/enums/service-info.enum';
import { ExchangeType } from 'src/shares/enums/exchange.enum';

export class ProductInfo {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsMongoId()
  producer_id?: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNumber()
  service_production_location?: string;
}

export class OtherFee {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  price?: number;
}

export class ServiceCharge {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  price?: number;
}

export class SellingFee {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsMongoId()
  unit_id: string;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  price?: number;
}

export class SellingInfo {
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  deposit?: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  activation_fee?: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  network_opening_fee?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  other_fee?: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  total?: number;
}

export class SellingExchange {
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  price?: number;

  @ApiProperty({
    required: true,
    enum: ExchangeType,
  })
  @IsEnum(ExchangeType)
  exchange_type: ExchangeType;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsMongoId()
  unit_id: string;
}

export class Attribute {
  @ApiProperty({ required: true })
  @IsString()
  name?: string;

  @ApiProperty({ required: true })
  @IsString()
  value?: string;
}

export class CreateServiceInfoDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  code: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsMongoId()
  type_service_id: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({ required: true, enum: BuyType })
  @IsEnum(BuyType)
  readonly buy_type?: BuyType;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsMongoId()
  service_group_id: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  capacity_id: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  contract_id?: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsMongoId()
  type_service_use_id?: string;

  @ApiProperty({
    required: true,
    type: ProductInfo,
  })
  producer_info?: ProductInfo;

  @ApiProperty({
    required: false,
    type: OtherFee,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherFee)
  other_fees?: OtherFee[];

  @ApiProperty({
    required: false,
    type: ServiceCharge,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceCharge)
  service_charges?: ServiceCharge[];

  @ApiProperty({
    required: true,
    type: SellingFee,
  })
  selling_fee?: SellingFee;

  @ApiProperty({
    required: true,
    type: SellingInfo,
  })
  selling_info?: SellingInfo;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  image_url: string[];

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({
    required: false,
    type: SellingExchange,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SellingExchange)
  selling_exchanges?: SellingExchange[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  currency_unit_id?: string;

  @ApiProperty({
    required: false,
    type: Attribute,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribute)
  attributes?: Attribute[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  default_selling_price?: number;
}
