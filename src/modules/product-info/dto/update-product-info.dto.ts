import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsEnum, IsMongoId, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { ProductInfoStatus } from 'src/shares/enums/product-info.enum';

export class ProducerInfo {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  producer_id?: string;

  @ApiProperty({ required: false, example: '0001' })
  @IsOptional()
  @IsString()
  product_production_location?: string;
}

export class BuyingAndSellingExchange {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  exchange_type?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  unit_id?: string;
}

export class Attribute {
  @ApiProperty({ required: true })
  @IsString()
  name?: string;

  @ApiProperty({ required: true })
  @IsString()
  value?: string;
}

export class UpdateProductInfoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  readonly product_type_id?: string;

  @ApiProperty({ required: false, enum: ProductInfoStatus })
  @IsOptional()
  @IsEnum(ProductInfoStatus)
  readonly status?: ProductInfoStatus;

  @ApiProperty({ required: false, example: 'sim' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false, example: '0001' })
  @IsOptional()
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  readonly group_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  readonly type_product_use_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  currency_unit_id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  unit_id?: string;

  @ApiProperty({ required: false, type: ProducerInfo })
  @IsOptional()
  readonly producer_info?: ProducerInfo;

  @ApiProperty({
    required: false,
    type: BuyingAndSellingExchange,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BuyingAndSellingExchange)
  selling_exchanges?: BuyingAndSellingExchange[];

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  default_selling_price?: number;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  image_url: string[];

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly desc: string;

  @ApiProperty({
    required: true,
    type: Attribute,
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Attribute)
  attributes?: Attribute[];
}
