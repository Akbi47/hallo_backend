import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentMethod, ShippingMethodSchema } from './schemas/payment-method.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentMethod.name, schema: ShippingMethodSchema }
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
