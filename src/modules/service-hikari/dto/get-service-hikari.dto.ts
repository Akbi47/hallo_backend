import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsDateString, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator'
import { Trim } from 'src/shares/decorators/transforms.decorator'
import { PaginationDto } from 'src/shares/dtos/pagination.dto'

export class GetServiceHikariDto extends PaginationDto {
  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  readonly host?: string

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  readonly type_house?: string
}
