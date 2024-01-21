import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { StatusEnum } from 'src/shares/enums/hikari.enum';

export class CreateWarrantyDto {
  
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  old_product_id?: string
  
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  old_product_iccid?: string
  
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  old_product_imei?: string
  
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  client_name?: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  link_pancake?: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  old_service?: string
  
  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  old_equipment_condition?: number

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  problem?: number

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  zip_code?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  new_product_imei?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  new_product_id?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  new_product_iccid?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  new_service?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  bill_code?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  surcharge?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  fee_payer?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  transfer_fee?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  created_by?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
