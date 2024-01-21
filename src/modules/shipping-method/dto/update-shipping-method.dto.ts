import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShippingMethodStatus } from 'src/shares/enums/shipping.enum';

export class UpDateShippingMethodDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ required: false, enum: ShippingMethodStatus })
  @IsOptional()
  @IsEnum(ShippingMethodStatus)
  status?: ShippingMethodStatus;
}
