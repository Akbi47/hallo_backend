import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentInfo, PaymentInfoSchema } from '../payment-transaction/schemas/payment-info.schema';
import {
  PaymentTransaction,
  PaymentTransactionSchema,
} from '../payment-transaction/schemas/payment-transaction.schema';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentInfo.name, schema: PaymentInfoSchema },
      { name: PaymentTransaction.name, schema: PaymentTransactionSchema },
    ]),
    ProductModule,
  ],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
