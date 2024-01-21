import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CheckPaymentInfoDto } from './dto/check-payment.dto';
import { PaymentInfo } from '../payment-transaction/schemas/payment-info.schema';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('success')
  success(@Res() res: Response): void {
    res.send('payment success!');
  }

  @Get('cancel')
  handleCancel(@Res() res: Response): void {
    res.send('payment cancel success!');
  }

  // TODO: TESTING MAKE PAYMENT
  @Post('make-payment')
  makePayment(): Promise<any> {
    return this.stripeService.makePaymentTesting();
  }

  @Post('check-payment')
  checkPayment(@Body() { payment_info_id }: CheckPaymentInfoDto): Promise<PaymentInfo> {
    return this.stripeService.checkPaymentDetail(payment_info_id);
  }

  @Post('webhook')
  handlePaymentWebhook(@Body() payload: any): any {
    return this.stripeService.handlerEventWebhook(payload);
  }
}
