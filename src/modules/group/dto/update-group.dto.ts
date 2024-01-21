import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export class UpdateGroupDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly desc?: string;

  @ApiProperty({ required: false, enum: TypeTypeEnum })
  @IsOptional()
  @IsEnum(TypeTypeEnum)
  type: TypeTypeEnum;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly img: string;
}
