import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { GroupKeyEnum } from 'src/shares/enums/group.enum';
import { ProductStatusEnum, ProductTypeEnum } from 'src/shares/enums/product.enum';

export class GetProductDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly id?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false, enum: ProductTypeEnum })
  @IsOptional()
  @IsEnum(ProductTypeEnum)
  type?: ProductTypeEnum;

  @ApiProperty({ required: false, enum: ProductStatusEnum })
  @IsOptional()
  @IsEnum(ProductStatusEnum)
  status?: ProductStatusEnum;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly client_id?: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // @IsMongoId()
  // readonly info_id?: string; // trung ben  duoi

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  readonly type_id?: string;

  @ApiProperty({ required: false, enum: GroupKeyEnum })
  @IsOptional()
  @IsEnum(GroupKeyEnum)
  group_key?: GroupKeyEnum;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly sort_field?: string;
}
