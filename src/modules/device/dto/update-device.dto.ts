import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { DeviceStatus } from 'src/shares/enums/device.enum';

export class UpdateDeviceDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, enum: DeviceStatus })
  @IsOptional()
  @IsEnum(DeviceStatus)
  readonly status?: DeviceStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly desc?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly buying_price?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  readonly selling_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly currency?: string;
}
