import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsOptional, ValidateNested } from 'class-validator';

export class Product {
  @ApiProperty({ required: true })
  @IsMongoId()
  readonly product_info_id: string;

  @ApiProperty({ required: true })
  @IsNumber()
  readonly quantity: number;
}

export class CreateCartDto {
  @ApiProperty({
    required: false,
    type: Product,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Product)
  products?: Product[];
}
