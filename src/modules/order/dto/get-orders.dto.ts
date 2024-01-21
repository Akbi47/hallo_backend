import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { OrderPaymentMethod, OrderPurchaseStatus, OrderStatus } from 'src/shares/enums/order.enum';

export class GetOrderDto extends PaginationDto {
  //admin
  @ApiProperty({ required: false })
  @IsMongoId({ each: true })
  @IsOptional()
  user_id?: string[];

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  order_id?: string;

  // @ApiProperty({ required: false })
  // @IsMongoId()
  // @IsOptional()
  // client_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  client_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  client_phone_number?: string;

  //method to shipping
  @ApiProperty({ required: false })
  @IsMongoId({ each: true })
  @IsOptional()
  shipping_method_id?: string[];

  // service type
  @ApiProperty({ required: false })
  @IsMongoId({ each: true })
  @IsOptional()
  service_info_id?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OrderStatus, { each: true })
  status?: OrderStatus[];

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsEnum(PackageShippingStatus, { each: true })
  // package_shipping_status?: PackageShippingStatus[];

  // @ApiProperty({ required: false })
  // @IsMongoId({ each: true })
  // @IsOptional()
  // source_ids?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OrderPurchaseStatus, { each: true })
  purchase_status?: OrderPurchaseStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OrderPaymentMethod, { each: true })
  payment_method?: OrderPaymentMethod[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  from_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  to_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  sort_by?: string;
}
export class GetClientOrderHistoryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  order_id?: string;

  // //method to shipping
  // @ApiProperty({ required: false })
  // @IsMongoId({ each: true })
  // @IsOptional()
  // shipping_method_id?: string[];

  // // service type
  // @ApiProperty({ required: false })
  // @IsMongoId({ each: true })
  // @IsOptional()
  // service_info_id?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsEnum(OrderPaymentMethod, { each: true })
  // payment_method?: OrderPaymentMethod[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  from_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  to_date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  sort_by?: string;
}

export class GetClientOrderDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  order_id?: string;
}
