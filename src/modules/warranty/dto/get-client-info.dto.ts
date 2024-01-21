import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/shares/dtos/pagination.dto'

export class GetClientDto extends PaginationDto {
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
}
