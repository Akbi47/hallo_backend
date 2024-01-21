import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ChangeAvatarDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  readonly avatarId: number;
}
