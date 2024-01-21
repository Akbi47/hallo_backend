import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginFacebookDto {
  @ApiProperty({ description: 'Facebook access_token' })
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string;
}
