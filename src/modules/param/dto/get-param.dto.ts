import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Capacity } from 'src/modules/capacity/schemas/capacity.schema';
import { Contract } from 'src/modules/contract/schema/contracts.schema';
import { Device } from 'src/modules/device/schemas/device.schema';
import { Group } from 'src/modules/group/schemas/group.schema';
import { TypeUse } from 'src/modules/type-use/schemas/type-use.schema';
import { Supplier } from 'src/modules/supplier/schemas/supplier.schema';
import { Type } from 'src/modules/type/schemas/type.schema';
import { Unit } from 'src/modules/unit/schema/unit.schema';
import { Trim } from 'src/shares/decorators/transforms.decorator';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export class GetParamDto {
  @ApiProperty({
    required: true,
    example: 'order',
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class GetParamInfoDto {
  @ApiProperty({
    required: false,
  })
  @Trim()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false, enum: TypeTypeEnum })
  @IsOptional()
  @IsEnum(TypeTypeEnum)
  type: TypeTypeEnum;
}

export class ResGetParamDto {
  type_service_uses: TypeUse[];
  capacities: Capacity[];
  type_services: Type[];
  service_group: Group[];
  suppliers: Supplier[];
  units: Unit[];
  contracts: Contract[];
  devices: Device[];
}
