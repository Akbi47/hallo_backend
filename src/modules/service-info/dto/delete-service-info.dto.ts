import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteServiceInfoDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}

export class DeleteServiceInfosDto {
  @ApiProperty({
    required: true,
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  ids: string[];
}
