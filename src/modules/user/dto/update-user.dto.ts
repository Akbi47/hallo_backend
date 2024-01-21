import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ default: 'John Doe' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  readonly name?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({ default: 'https://resq-bucket-2.s3.amazonaws.com/test/1681115579264_c49717abc07d480.jpeg' })
  @IsOptional()
  @IsNumber()
  @IsString()
  readonly image_url?: string;
}
