import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types, Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  CancelReason,
  DeliveryTime,
  OrderPaymentMethod,
  OrderStatus,
  PackageShippingStatus,
  ReconfirmReason,
  ShippingPromotionItemsStatus,
} from 'src/shares/enums/order.enum';
import { ProductOrderLine } from './create-order.dto';
import { Type } from 'class-transformer';

export class TimestampDto {
  @ApiProperty({ required: false })
  start_time: number;
  @ApiProperty({ required: false })
  end_time: number;
}

export class DateDto {
  @ApiProperty({ required: false })
  start_date?: number;

  @ApiProperty({ required: false })
  end_date?: number;
}

export class PhoneTime {
  @ApiProperty({ required: false, type: Schema.Types.Date })
  end_time: Schema.Types.Date;

  @ApiProperty({ required: false, type: Schema.Types.Date })
  start_time: Schema.Types.Date;
}
export class AddOrderLine {
  @ApiProperty({ required: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductOrderLine)
  product_order_line: ProductOrderLine[];
}

export class ChangeStatus {
  @ApiProperty({ required: true, enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class ChangeBulkStatus extends ChangeStatus {
  @ApiProperty({ required: true })
  @IsMongoId({ each: true })
  order_id?: string[];
}

export class CancelOrder {
  @ApiProperty({ required: false, enum: CancelReason })
  @IsOptional()
  cancel_reason: CancelReason;

  @ApiProperty({ required: false })
  @IsOptional()
  cancel_note: string;
}
export class ReconfirmOrder {
  @ApiProperty({ required: false, enum: ReconfirmReason })
  @IsOptional()
  reconfirm_reason: ReconfirmReason;

  @ApiProperty({ required: false })
  @IsOptional()
  reconfirm_note: string;
}

export class updateOrderDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  payment_method: OrderPaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  promotions: Types.ObjectId[];

  @ApiProperty({ required: false, enum: DeliveryTime })
  @IsOptional()
  delivery_time: DeliveryTime;

  @ApiProperty({ required: false, type: Schema.Types.Date })
  @IsOptional()
  delivery_date: Date;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  zip_code: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  recipient_phoneNumber: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  shipping_address: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  shipping_method_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  shipping_fee: number;

  @ApiProperty({ required: false })
  @IsOptional()
  reconfirm_note: string;

  @ApiProperty({ required: true })
  @IsArray()
  @ArrayMinSize(1) // You can adjust the minimum size as needed
  @IsOptional()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProductOrderLine)
  product_order_line: ProductOrderLine[];
}

export class ProductShippingMap {
  @ApiProperty({ required: true })
  @IsMongoId()
  product_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  imei: string;

  @ApiProperty({ required: false })
  @IsOptional()
  iccid: string;
}

export class updateShippingInfoDto {
  @ApiProperty({ required: false, enum: DeliveryTime })
  @IsOptional()
  delivery_time: DeliveryTime;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  delivery_date: Date; // ngay nhan du kien

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  shipping_at: Date; // ngay gui hang

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  receive_at: Date; // ngay nhan hang

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  shipping_bill: string;

  @ApiProperty({ required: false, enum: PackageShippingStatus })
  @IsEnum(PackageShippingStatus)
  @IsOptional()
  package_shipping_status: PackageShippingStatus;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  shipping_note: string;

  @ApiProperty({ required: false, enum: ShippingPromotionItemsStatus })
  @IsOptional()
  @IsEnum(ShippingPromotionItemsStatus)
  shipping_promotion_items_status: ShippingPromotionItemsStatus;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  user_note: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  envelope_stamp: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  contract_stamp: string;

  @ApiProperty({ required: true })
  @IsArray()
  @ArrayMinSize(1) // You can adjust the minimum size as needed
  @IsOptional()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ProductShippingMap)
  product_shipping_map: ProductShippingMap[];
}
