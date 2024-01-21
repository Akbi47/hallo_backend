import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString, IsNumber } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { BuyType } from 'src/shares/enums/service-info.enum';

export class GetServiceInfoDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly id?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false, enum: BuyType })
  @IsOptional()
  @IsEnum(BuyType)
  readonly buy_type?: BuyType;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly contract_name?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly deposit?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly activation_fee?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly selling_price?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly network_opening_fee?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly total_price?: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly desc?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly type_service_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly start_date?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly end_date?: number;
}
