import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { PaginationDto } from 'src/shares/dtos/pagination.dto';

export class GetClientsDto extends PaginationDto {
  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsMongoId()
  @Trim()
  readonly id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}

export class GetClientByPhoneOrderDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
