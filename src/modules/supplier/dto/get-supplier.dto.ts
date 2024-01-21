import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetSupplierDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly id?: string;
}
