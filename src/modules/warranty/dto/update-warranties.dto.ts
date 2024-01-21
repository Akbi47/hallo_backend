import { PartialType } from '@nestjs/swagger';
import { CreateWarrantyDto } from './create-warranties.dto';

export class UpdateWarrantyDto extends PartialType(CreateWarrantyDto) {}
