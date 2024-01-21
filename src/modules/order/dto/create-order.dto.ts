import {
  ArrayMinSize,
  IsArray,
  // IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Schema, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryTime, OrderPaymentMethod, OrderPurchaseStatus, OrderType } from 'src/shares/enums/order.enum';
import { CreateClientDto } from 'src/modules/client/dto/create-client.dto';
import { Type } from 'class-transformer';
// import { Product } from 'src/modules/product/schemas/product.schema';

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

//  class CreateClientDto {
//   @ApiProperty({ required: false })
//   start_date?: number;

//   @ApiProperty({ required: false })
//   end_date?: number;
// }

export class PhoneTime {
  @ApiProperty({ required: false, type: Date })
  end_time: Schema.Types.Date;

  @ApiProperty({ required: false, type: Date })
  start_time: Schema.Types.Date;
}

export class ServiceOrderLine {
  @ApiProperty({ required: true })
  @IsMongoId()
  service_id: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  device_id: string;

  @ApiProperty({ required: false })
  @IsNumber()
  monthly_fee: number;

  @ApiProperty({ required: false })
  @IsNumber()
  first_month_fee: number;

  @ApiProperty({ required: false })
  @IsNumber()
  next_month_fee: number;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  extend_to: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  initial_fee: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  surcharge: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  deduction: number;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  created_at: Date;
}
export class ProductOrderLine {
  @ApiProperty({ required: true })
  @IsMongoId()
  product_id: string;

  @ApiProperty({ required: true, default: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  device_id: string;

  @ApiProperty({ required: false })
  @IsNumber()
  monthly_fee: number;

  @ApiProperty({ required: false })
  @IsNumber()
  first_month_fee: number;

  @ApiProperty({ required: false })
  @IsNumber()
  next_month_fee: number;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  extend_to: Date;

  @ApiProperty({ required: false })
  @IsNumber()
  initial_fee: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  surcharge: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  deduction: number;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  created_at: Date;
}
// type OrderLine = ProductOrderLine | ServiceOrderLine;

export class ProductOrderLineClient {
  @ApiProperty({ required: true })
  @IsMongoId()
  product_id: string;

  @ApiProperty({ required: true, default: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: true, type: Date })
  @IsDate()
  extend_to: Date;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  created_at: Date;
}

export class CreateOrderDto {
  // @ApiProperty({ required: false })
  // @IsBoolean()
  // @IsOptional()
  // is_service: boolean;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  shipping_address: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  payment_method: OrderPaymentMethod;

  @ApiProperty({ required: false, enum: DeliveryTime })
  @IsOptional()
  delivery_time: DeliveryTime;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  delivery_date: Date;

  //method to shipping
  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  shipping_method_id: string;

  // @ApiProperty({ required: false, type: Date })
  // @IsOptional()
  // @IsDate()
  // shipping_date?: Schema.Types.Date;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // shipping_type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  promotions: Types.ObjectId[];

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  promotion_quantity: number;

  // @ApiProperty({ required: true, type: String })
  // @IsOptional()
  // @IsString()
  // user_note?: string;

  // @ApiProperty({ required: false, type: Number })
  // @IsNumber()
  // quantity: number;

  // @ApiProperty({ required: true, type: String })
  // @IsString()
  // zip_code: string;

  // @ApiProperty({ required: true, type: String })
  // @IsString()
  // address: string;

  // @ApiProperty({ required: false, type: Date })
  // @IsOptional()
  // @IsDate()
  // receive_at?: Schema.Types.Date;

  // @ApiProperty({ required: false, type: String })
  // @IsOptional()
  // @IsString()
  // user_note?: string;

  // @ApiProperty({ required: false, type: String })
  // @IsOptional()
  // @IsString()
  // shipping_note?: string;

  // @ApiProperty({ required: false, type: String })
  // @IsOptional()
  // @IsString()
  // language?: string;

  // @ApiProperty({ required: false, type: String })
  // @IsOptional()
  // @IsString()
  // origin?: string;

  // @ApiProperty({ required: false, type: PhoneTime })
  // @IsOptional()
  // phone_time?: PhoneTime;

  // @ApiProperty({ required: false, type: Number })
  // @IsNumber()
  // deposit: number;
}

export class CreateOrderDtoClient extends CreateOrderDto {
  @ApiProperty({ required: true, type: ProductOrderLineClient, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductOrderLineClient)
  product_order_line: ProductOrderLineClient[];

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
  recipient_name: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  shipping_address: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  shipping_method_id: string;

  // @ApiProperty({ required: false, type: Date })
  // @IsOptional()
  // @IsDate()
  // receive_at: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  user_note: string;
}
export class CreateOrderDtoAdmin extends CreateOrderDto {
  @ApiProperty({ required: false, enum: OrderType })
  @IsOptional()
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({ required: true })
  @IsMongoId()
  // @IsOptional()
  user_id: string;

  @ApiProperty({ required: false, type: String })
  @IsString()
  @IsOptional()
  describe: string;

  @ApiProperty({ required: false })
  @IsOptional()
  client?: CreateClientDto;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  client_id: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  link_pancake: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  name_pancake?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  shipping_fee: number;

  @ApiProperty({ required: false, enum: OrderPurchaseStatus })
  @IsOptional()
  @IsEnum(OrderPurchaseStatus)
  purchase_status: OrderPurchaseStatus = OrderPurchaseStatus.Potential_Customer;

  @ApiProperty({ required: true, type: ProductOrderLine, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductOrderLine)
  product_order_line: ProductOrderLine[];
}
