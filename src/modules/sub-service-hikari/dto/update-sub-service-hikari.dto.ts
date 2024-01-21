import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { PaginationDto } from 'src/shares/dtos/pagination.dto'

export class SubService {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  _id?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  service_id?: string

  @ApiProperty({ required: false, type: String })
  @IsString()
  name: string

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  cost: number
}

export class UpdateSubService extends PaginationDto {
  @ApiProperty({
    required: false,
    type: SubService,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubService)
  subServices?: SubService[]
}
