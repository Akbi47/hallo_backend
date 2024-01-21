import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
