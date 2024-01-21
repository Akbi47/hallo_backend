import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApplyProductAndService, PromotionalStatus, SubjectsToApply } from 'src/shares/enums/promotional.enum';

export class ActiveTimeAfterCondition {
  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  end_date?: Date;
}

export class PromoPriceCondition {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  value: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  unit_id: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  condition: number;

  @ApiProperty({
    required: false,
    type: ActiveTimeAfterCondition,
  })
  @IsOptional()
  activation_time_after_condition?: ActiveTimeAfterCondition;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  end_date?: Date;
}

export class Condition {
  @ApiProperty({ required: false, enum: SubjectsToApply })
  @IsOptional()
  @IsNumber()
  @IsEnum(SubjectsToApply)
  subjects_to_apply?: SubjectsToApply;

  @ApiProperty({ required: false, type: String })
  @IsMongoId()
  @IsString()
  @IsOptional()
  shipping_method_id?: string;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  number_of_times_applier?: number;

  @ApiProperty({ required: false, enum: ApplyProductAndService })
  @IsOptional()
  @IsEnum(ApplyProductAndService)
  type_applicable_product?: ApplyProductAndService;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  applicable_products?: string[];

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  start_date: Date;

  @ApiProperty({ required: false, type: Date })
  @IsDate()
  @IsOptional()
  end_date: Date;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  total_order_value_from?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  total_order_value_to?: number;
}

export class PromoInfo {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  bill_discount_percent?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  discount_delivery_percent?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  discount_delivery_value?: number;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  end_date?: Date;
}

export class UpdatePromotionDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  type_apply_discount: number;

  @ApiProperty({ required: false, type: String })
  @IsMongoId()
  @IsString()
  @IsOptional()
  promotional_group_id?: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsString()
  @IsOptional()
  currency_unit_id?: string;

  @ApiProperty({
    required: false,
    type: Condition,
  })
  @IsOptional()
  product_condition?: Condition;

  @ApiProperty({
    required: false,
    type: PromoInfo,
  })
  @IsOptional()
  promo_info?: PromoInfo;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  readonly gifts?: string[];

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  image_url: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsOptional()
  @IsString()
  desc: string;

  @ApiProperty({ required: false, enum: PromotionalStatus })
  @IsOptional()
  @IsEnum(PromotionalStatus)
  status?: PromotionalStatus;
}
