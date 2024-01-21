import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export class UpdateTypeDto {
  @ApiProperty({
    required: false,
    example: '30GB',
  })
  @IsOptional()
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    example: 'desc info ',
  })
  @IsOptional()
  @Trim()
  @IsNotEmpty()
  @IsString()
  desc: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  code: number;

  @ApiProperty({ required: false, enum: TypeTypeEnum })
  @IsOptional()
  @IsEnum(TypeTypeEnum)
  type?: TypeTypeEnum;
}
