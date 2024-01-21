import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsMongoId, IsOptional, IsString, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { ProductInfoStatus } from 'src/shares/enums/product-info.enum';

export class ProducerInfo {
  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  producer_id?: string;

  @ApiProperty({ required: true, example: '0001' })
  @IsString()
  product_production_location?: string;
}

export class Attribute {
  @ApiProperty({ required: true })
  @IsString()
  name?: string;

  @ApiProperty({ required: true })
  @IsString()
  value?: string;
}

export class SellingExchange {
  @ApiProperty({ required: true })
  @IsNumber()
  price: number;

  @ApiProperty({ required: true })
  @IsNumber()
  exchange_type: number;

  @ApiProperty({ required: true })
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  unit_id: string;
}

export class CreateProductInfoDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  readonly product_type_id?: string;

  @ApiProperty({ required: true, example: 'sim' })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: true, example: '0001' })
  @IsString()
  readonly code: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  readonly group_id?: string;

  @ApiProperty({ required: true })
  @IsMongoId()
  @IsString()
  readonly type_product_use_id?: string;

  @ApiProperty({
    required: true,
  })
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

  @ApiProperty({ required: true, type: ProducerInfo })
  readonly producer_info?: ProducerInfo;

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
    required: true,
    type: SellingExchange,
    isArray: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SellingExchange)
  selling_exchanges?: SellingExchange[];

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  default_selling_price?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  readonly image_url?: string[];

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly desc: string;

  @ApiProperty({ required: false, enum: ProductInfoStatus })
  @IsOptional()
  @IsEnum(ProductInfoStatus)
  status?: ProductInfoStatus;
}
