import { IsDate, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    required: true,
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    required: true,
    example: '123456789',
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    required: false,
    example: 'john wick',
  })
  @IsOptional()
  @IsNotEmpty()
  readonly name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsDate()
  readonly birthday?: Date;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly gender?: number;
}

export interface SignUpInterface {
  email: string;
  password: string;
  name: string;
  code: string;
  birthday: Date;
  gender: number;
}

export interface SignUpCacheInterface extends SignUpInterface {
  attempt: number;
}
