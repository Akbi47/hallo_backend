import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileNameDto {
  @ApiProperty({ default: 'No Name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(1)
  @Matches(/^([a-zA-Z0-9\-\_\.]+)$/)
  name: string;
}
