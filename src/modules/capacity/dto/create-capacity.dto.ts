import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class CreateCapacityDto {
  @ApiProperty({
    required: true,
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;
}
