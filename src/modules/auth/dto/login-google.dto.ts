import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginGoogleDto {
  @ApiProperty({ description: 'Google access_token' })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
