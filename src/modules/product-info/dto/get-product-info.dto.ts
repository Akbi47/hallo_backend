import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class GetProductInfoDto extends PaginationDto {
  @ApiProperty({ required: false, type: Boolean })
  @IsOptional()
  readonly deleted?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  default_selling_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly currency?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @IsString()
  readonly product_type_id?: string;
}
