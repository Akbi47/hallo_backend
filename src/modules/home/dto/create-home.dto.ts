import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class Utilities {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly image_url?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;
}

export class CreateHomeDto {
  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  readonly image_urls?: string[];

  @ApiProperty({
    required: false,
    type: Utilities,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Utilities)
  utilities?: Utilities[];
}
