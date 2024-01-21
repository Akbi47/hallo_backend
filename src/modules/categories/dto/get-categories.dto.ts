import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetCategoriesDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly id?: string;
}
