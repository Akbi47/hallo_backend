import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetPromotion extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly subjects_to_apply?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly id?: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  readonly start_date?: Date;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  readonly end_date?: Date;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly total_order_value_from?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly total_order_value_to?: number;
}
