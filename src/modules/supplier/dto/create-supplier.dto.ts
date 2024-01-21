import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { SupplierStatus } from 'src/shares/enums/supplier.enum';

export class CreateSupplierDto {
  @ApiProperty({
    required: true,
    example: 'Sim-HaNoi',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    example: 'SB',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsMongoId()
  type_id: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsArray()
  @IsOptional()
  image_url: string[];

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  desc?: string;

  @ApiProperty({ required: false, enum: SupplierStatus })
  @IsOptional()
  @IsEnum(SupplierStatus)
  status?: SupplierStatus;
}
