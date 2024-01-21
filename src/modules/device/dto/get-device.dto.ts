import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetDriveDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  readonly id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly currency?: string;
}
