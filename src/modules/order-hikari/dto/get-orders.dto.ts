import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetOrderDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  @Trim()
  user_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  client_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  order_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly code?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly host_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly house_id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly type_contract?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly time_contact?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly status_mode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  readonly status?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsDateString()
  @IsOptional()
  readonly start_date?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsDateString()
  @IsOptional()
  readonly end_date?: string;
}
