import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ required: true, type: String })
  name: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  desc?: string;
}
