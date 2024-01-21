import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class UpdateParamDto {
  @ApiProperty({
    required: false,
    example: 'order',
  })
  @IsOptional()
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  capacities: string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  type_services: string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  services: string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  suppliers: string[];

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  type_service_uses?: string[] = [];
}
