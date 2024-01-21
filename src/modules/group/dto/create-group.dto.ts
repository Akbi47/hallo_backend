import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export class CreateGroupDto {
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

  @ApiProperty({ required: true, enum: TypeTypeEnum })
  @IsEnum(TypeTypeEnum)
  type: TypeTypeEnum;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  readonly img: string;
}
