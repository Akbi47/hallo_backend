import { PartialType } from '@nestjs/swagger';
import { CreateAddressShippingDto } from './create-address-shipping.dto';

export class UpdateAddressShippingDto extends PartialType(CreateAddressShippingDto) {}
