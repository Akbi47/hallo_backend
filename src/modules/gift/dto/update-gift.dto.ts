import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { GiftStatus } from 'src/shares/enums/gift.enum';

export class UpdateGiftDto {
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  desc: string;

  @ApiProperty({ required: false, enum: GiftStatus })
  @IsOptional()
  @IsEnum(GiftStatus)
  status?: GiftStatus;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  image_url: string;
}
