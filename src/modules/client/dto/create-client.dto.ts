import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    required: true,
    example: 'user@gmail.com',
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    required: true,
    example: '123',
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    required: true,
    example: 'john wick',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly birthday?: Date;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly gender?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly full_name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly japanese_name?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly method_contact?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly pancake?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  readonly status_mode?: number;
}
