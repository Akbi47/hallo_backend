import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export class CreateTypeDto {
  @ApiProperty({
    required: true,
    example: '30GB',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: '30GB',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  desc: string;

  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @ApiProperty({ required: true, enum: TypeTypeEnum })
  @IsEnum(TypeTypeEnum)
  type: TypeTypeEnum;
}
