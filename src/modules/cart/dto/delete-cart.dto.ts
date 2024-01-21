import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class DeleteCartDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  @Trim()
  readonly id: string;
}
