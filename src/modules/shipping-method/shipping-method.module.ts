import { Module } from '@nestjs/common';
import { ShippingMethodController } from './shipping-method.controller';
import { ShippingMethodService } from './shipping-method.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingMethod, ShippingMethodSchema } from './schemas/shipping-method.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ShippingMethod.name, schema: ShippingMethodSchema }])],
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService],
})
export class ShippingMethodModule {}
