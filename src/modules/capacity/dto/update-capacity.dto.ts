import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class UpdateCapacityDto {
  @ApiProperty({
    required: true,
    example: '60GB',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;
}
