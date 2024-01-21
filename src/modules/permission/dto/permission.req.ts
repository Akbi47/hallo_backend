import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PermissionReq {
  @ApiProperty({
    required: true,
    example: 'admin',
  })
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    required: true,
    example: ['/permission/add-new'],
  })
  @IsNotEmpty()
  readonly arrayRoutes: string[];

  @ApiProperty({
    required: true,
    example: ['/permission/add-new'],
  })
  @IsNotEmpty()
  readonly endpointAccess: string[];

  @ApiProperty({
    required: true,
    example: ['64d59c81beceabb8635c97df'],
  })
  @IsNotEmpty()
  readonly clientUsers: string[];

  @ApiProperty({
    required: true,
    example: ['64d59c81beceabb8635c97d1'],
  })
  @IsNotEmpty()
  readonly internalUsers: string[];

  @ApiProperty({
    required: true,
    example: true,
  })
  @IsNotEmpty()
  readonly active: boolean;
}
