import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { GroupKeyEnum } from 'src/shares/enums/group.enum';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export class GetGroupDto extends PaginationDto {
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

  @ApiProperty({ required: false, enum: TypeTypeEnum })
  @IsOptional()
  @IsEnum(TypeTypeEnum)
  type: TypeTypeEnum;

  @ApiProperty({ required: false, enum: GroupKeyEnum })
  @IsOptional()
  @IsEnum(GroupKeyEnum)
  key: GroupKeyEnum;
}
