import { Module } from '@nestjs/common';
import { AddressShippingService } from './address-shipping.service';
import { AddressShippingController } from './address-shipping.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressShippingMethod, AddressShippingMethodSchema } from './schemas/address-shipping.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AddressShippingMethod.name, schema: AddressShippingMethodSchema }
    ]),
  ],
  controllers: [AddressShippingController],
  providers: [AddressShippingService]
})
export class AddressShippingModule {}
