import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApplyProductAndService, CampaignStatus, CampaignType } from 'src/shares/enums/promotional.enum';

export class CreateCampaignDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  readonly subjects_to_apply?: number;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsString()
  @IsOptional()
  currency_unit_id?: string;

  @ApiProperty({ required: false, enum: CampaignStatus })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ApplyProductAndService)
  readonly type_applicable_product?: ApplyProductAndService;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  readonly applicable_products?: string[];

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsEnum(CampaignType)
  readonly campaign_type?: CampaignType;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  reduction_amount?: number;

  @ApiProperty({ required: false, type: Number })
  @IsOptional()
  @IsNumber()
  refund_amount?: number;

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
}
