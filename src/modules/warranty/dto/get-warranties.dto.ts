import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetWarrantyDto extends PaginationDto {
  
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
  client_name?: string

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  old_type_service_id?: string

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  status?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  end_date?: Date;
}
