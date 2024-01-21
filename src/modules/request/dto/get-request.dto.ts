import { PaginationDto } from 'src/shares/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GetRequestDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly title?: string;
}
