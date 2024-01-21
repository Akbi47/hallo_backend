import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateRefundHiakriDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  order_hikari_id: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly refund_time?: Date;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  reason: number;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  another_reason: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  cost: number;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  card: boolean;

  // @ApiProperty({ required: false, type: [{ type: String }] })
  @IsArray()
  @IsString({ each: true })
  information_card: string[];

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  note: string;
}
