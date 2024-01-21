import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  readonly desc?: string;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  readonly buying_price?: number;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  readonly selling_price?: number;

  @ApiProperty({ required: true })
  @IsString()
  readonly currency?: string;
}
