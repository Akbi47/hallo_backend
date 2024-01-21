import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ApplyProductAndService, CampaignStatus, CampaignType } from 'src/shares/enums/promotional.enum';

export class GetCampaignDto extends PaginationDto {
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
  @IsOptional()
  @IsString()
  readonly currency_name?: string;

  @ApiProperty({ required: false, enum: CampaignStatus })
  @IsOptional()
  @IsEnum(CampaignStatus)
  readonly status?: CampaignStatus;

  @ApiProperty({ required: false, enum: ApplyProductAndService })
  @IsOptional()
  @IsEnum(ApplyProductAndService)
  readonly type_applicable_product?: ApplyProductAndService;

  @ApiProperty({ required: false, enum: CampaignType })
  @IsNumber()
  @IsOptional()
  @IsEnum(CampaignType)
  readonly campaign_type?: CampaignType;
}
