import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CheckPaymentInfoDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  payment_info_id: string;
}
