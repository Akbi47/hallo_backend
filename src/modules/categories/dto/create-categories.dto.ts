import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class CreateCategoriesDto {
  @ApiProperty({
    required: true,
    example: 'sim',
  })
  @Trim()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    example: 'sim này có thể gọi toàn cầu',
  })
  @Trim()
  description?: string;
}
