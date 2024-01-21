import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';

export class UpdateAttributeDto {
  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly activation_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly service_opening_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly monthly_fee?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly desc?: string;
}
