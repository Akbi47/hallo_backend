import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class UpdateCategoriesDto {
  @ApiProperty({
    required: true,
    example: 'update new name category',
  })
  @Trim()
  name?: string;

  @ApiProperty({
    required: true,
    example: 'description mới',
  })
  @Trim()
  description?: string;
}
