import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly title: string;

  @ApiProperty({ required: true })
  @IsString()
  readonly desc: string;
}
