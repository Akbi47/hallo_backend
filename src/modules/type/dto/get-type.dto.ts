import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { GroupKeyEnum } from 'src/shares/enums/group.enum';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';
import { BuyType } from 'src/shares/enums/service-info.enum';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export class GetTypeDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false, enum: TypeTypeEnum })
  @IsOptional()
  @IsEnum(TypeTypeEnum)
  readonly type?: TypeTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly product_name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly product_group_id?: string;

  @ApiProperty({ required: false, enum: GroupKeyEnum })
  @IsOptional()
  @IsEnum(GroupKeyEnum)
  group_key: GroupKeyEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly product_capacity_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly product_contract_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly product_unit_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly product_currency_unit_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly producer_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly supplier_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Trim()
  readonly saihakko_fee_from?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Trim()
  readonly saihakko_fee_to?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  readonly product_imei?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  readonly product_iccid?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  readonly product_code?: string;

  @ApiProperty({ required: false, enum: BuyType })
  @IsOptional()
  @IsEnum(BuyType)
  readonly product_buy_type?: BuyType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Trim()
  readonly product_import_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Trim()
  readonly product_contract_expire_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly product_buying_price?: number;

  @ApiProperty({ required: false, enum: ProductStatusEnum })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  readonly product_status?: ProductStatusEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly product_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Trim()
  readonly product_ID?: string;
}
