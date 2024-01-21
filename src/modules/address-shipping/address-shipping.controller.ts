import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddressShippingService } from './address-shipping.service';
import { CreateAddressShippingDto } from './dto/create-address-shipping.dto';
import { UpdateAddressShippingDto } from './dto/update-address-shipping.dto';
import { GetAddressShippingMethodDto } from './dto/get-addressShipping.dto';

@Controller('address-shipping')
export class AddressShippingController {
  constructor(private readonly addressShippingService: AddressShippingService) { }

  @Post()
  create(@Body() createAddressShippingDto: CreateAddressShippingDto) {
    return this.addressShippingService.create(createAddressShippingDto);
  }

  @Get()
  findAll(@Query() query: GetAddressShippingMethodDto) {
    return this.addressShippingService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressShippingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressShippingDto: UpdateAddressShippingDto) {
    return this.addressShippingService.update(+id, updateAddressShippingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressShippingService.remove(+id);
  }
}
