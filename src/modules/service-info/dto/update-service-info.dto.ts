import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BuyType, ServiceInfoStatus } from 'src/shares/enums/service-info.enum';
import { ExchangeType } from 'src/shares/enums/exchange.enum';

export class ProductInfo {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  producer_id?: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  @IsNumber()
  service_production_location?: string;
}

export class OtherFee {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
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

export class BuyingSellingFee {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  unit_id: string;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
}

export class SellingExchange {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    required: false,
    enum: ExchangeType,
  })
  @IsEnum(ExchangeType)
  @IsOptional()
  exchange_type: ExchangeType;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  unit_id: string;
}

export class SellingInfo {
  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  deposit?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  activation_fee?: number;

  @ApiProperty({
    required: false,
    type: Number,
  })
  @IsOptional()
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
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  total?: number;
}

export class Attribute {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  value?: string;
}
export class UpdateServiceInfoDto {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsMongoId()
  @IsOptional()
  type_service_id: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, enum: BuyType })
  @IsOptional()
  @IsEnum(BuyType)
  readonly buy_type?: BuyType;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsMongoId()
  @IsOptional()
  service_group_id: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsMongoId()
  @IsOptional()
  capacity_id: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsMongoId()
  @IsOptional()
  contract_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsMongoId()
  @IsOptional()
  type_service_use_id?: string;

  @ApiProperty({
    required: false,
    type: ProductInfo,
  })
  @IsOptional()
  producer_info?: ProductInfo;

  @ApiProperty({
    required: false,
    type: [OtherFee],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherFee)
  @IsOptional()
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
    required: false,
    type: BuyingSellingFee,
  })
  @IsOptional()
  selling_fee?: BuyingSellingFee;

  @ApiProperty({
    required: false,
    type: SellingInfo,
  })
  @IsOptional()
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

  @ApiProperty({ required: false, enum: ServiceInfoStatus })
  @IsOptional()
  @IsEnum(ServiceInfoStatus)
  status?: ServiceInfoStatus;

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
