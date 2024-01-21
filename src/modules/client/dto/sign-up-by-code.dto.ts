import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpByCodeDto {
  @ApiProperty({
    required: true,
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  readonly code: string;
}
