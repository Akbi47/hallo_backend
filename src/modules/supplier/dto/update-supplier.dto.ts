import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { SupplierStatus } from 'src/shares/enums/supplier.enum';

export class UpdateSupplierDto {
  @ApiProperty({
    required: false,
    example: 'Sim-HaNoi',
  })
  @IsOptional()
  @Trim()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    example: 'SB',
  })
  @IsOptional()
  @Trim()
  @IsString()
  code: string;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  type_id: string;

  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
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
