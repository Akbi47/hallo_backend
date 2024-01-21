import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { getConfig } from 'src/configs/index';
import { lineItemDto } from './dto/line-item.dto';
import { httpErrors } from 'src/shares/exceptions';
import { PaymentInfo, PaymentInfoDocument } from '../payment-transaction/schemas/payment-info.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentStatus } from 'src/shares/enums/payment.enum';
import {
  PaymentTransaction,
  PaymentTransactionDocument,
} from '../payment-transaction/schemas/payment-transaction.schema';
import { CheckoutSession } from 'src/shares/interface/checkout-session-completed.interface';
import { ProductService } from '../product/product.service';
import { ProductTypeEnum } from 'src/shares/enums/product.enum';

const stripeConfig = getConfig().get<any>('stripe');
const secret_key = stripeConfig.api_key;
const success_url = stripeConfig.success_url;
const cancel_url = stripeConfig.cancel_url;

@Injectable()
export class StripeService {
  private stripeConfig: Stripe;

  constructor(
    @InjectModel(PaymentInfo.name) private paymentInfoModel: Model<PaymentInfoDocument>,
    @InjectModel(PaymentTransaction.name) private paymentTransactionModel: Model<PaymentTransactionDocument>,
    private productService: ProductService,
  ) {
    this.stripeConfig = new Stripe(secret_key, {
      apiVersion: '2023-08-16',
    });
  }

  async makePaymentTesting(): Promise<any> {
    // TODO: start transaction
    const { result } = await this.productService.find({ type: ProductTypeEnum.SERVICE });
    // format data line items
    const line_items: lineItemDto[] = result.map((p) => {
      return {
        price_data: {
          currency: p.service_info.currency_unit_name,
          product_data: {
            name: p.name,
          },
          unit_amount: p.service_info.selling_info.total,
        },
        quantity: 1,
      };
    });
    // create payment session
    return this.makePayment(line_items);
  }

  async makePayment(line_items: lineItemDto[]): Promise<{ url_payment: string }> {
    const sectionInfo = await this.createPaymentSessions(line_items);
    const { url, created, expires_at, id, object, amount_total, amount_subtotal, currency } = sectionInfo;

    const paymentInfo = new PaymentInfo();
    paymentInfo.session_id = id;
    paymentInfo.object = object;
    paymentInfo.currency = currency;
    paymentInfo.created = new Date(created * 1000);
    paymentInfo.expires_at = new Date(expires_at * 1000);
    paymentInfo.amount_subtotal = amount_subtotal;
    paymentInfo.amount_total = amount_total;
    paymentInfo.payment_info = JSON.stringify(sectionInfo);
    paymentInfo.link_payment = url;

    await this.paymentInfoModel.create(paymentInfo);

    return { url_payment: sectionInfo.url };
  }

  async createPaymentMethodTesting(): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    return this.stripeConfig.paymentMethods.create({
      type: 'card',
      card: {
        token: 'tok_visa',
      },
    });
  }

  // async confirmPaymentIntentByClientSecret(
  //   clientSecret: string,
  //   payment_method_id: string,
  // ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
  //   return this.stripeClientConfig.paymentIntents.confirm(clientSecret, {
  //     payment_method: payment_method_id,
  //   });
  // }

  async getPaymentInfoById(payment_info_id: string): Promise<any> {
    // get info product
    const payment_info = await this.paymentInfoModel.findById(payment_info_id);
    if (!payment_info) {
      throw new BadRequestException(httpErrors.PAYMENT_INFO_NOT_FOUND);
    }
    const { session_id, id } = payment_info;
    let payment_intent_id = payment_info.payment_intent_id;

    // get info session and update info
    if (!payment_intent_id) {
      const sessionPayment = await this.getPaymentInfoBySessionId(session_id);
      const { payment_intent } = sessionPayment;
      payment_intent_id = payment_intent as string;
      await this.paymentInfoModel.findByIdAndUpdate(id, { payment_intent_id: payment_intent });
    }

    // get info payment and update
    const payment_intent_info = await this.getPaymentIntentInfo(payment_intent_id);
    const { status } = payment_intent_info;
    return this.paymentInfoModel.findByIdAndUpdate(payment_info.id, { status: status.toUpperCase() }, { new: true });
  }

  async getPaymentInfoBySessionId(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return this.stripeConfig.checkout.sessions.retrieve(sessionId);
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripeConfig.paymentIntents.confirm(paymentIntentId);
  }

  async createPaymentSessions(line_items: lineItemDto[]): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const paymentInfo = await this.stripeConfig.checkout.sessions.create({
      line_items,
      mode: 'payment',
      payment_intent_data: {
        setup_future_usage: 'on_session',
      },
      success_url,
      cancel_url,
    });

    return paymentInfo;
  }

  async createPaymentIntents({
    amount,
    currency,
    payment_method_types,
  }: {
    amount: number;
    currency: string;
    payment_method_types: string[];
  }): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripeConfig.paymentIntents.create({
      amount,
      currency,
      payment_method_types,
      setup_future_usage: 'off_session',
      capture_method: 'manual',
    });
  }

  async refundPayment(paymentIntentId: string, amountToRefund: number): Promise<Stripe.Refund> {
    try {
      const refund = await this.stripeConfig.refunds.create({
        payment_intent: paymentIntentId,
        amount: amountToRefund,
      });
      return refund;
    } catch (error) {
      throw new Error(`Error refunding payment: ${error.message}`);
    }
  }

  async capturePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return this.stripeConfig.paymentIntents.capture(paymentIntentId);
    } catch (error) {
      throw new Error(`Error capturing payment: ${error.message}`);
    }
  }

  //TODO: Implement Transaction
  async handlerEventWebhook(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handlerCheckOutSessionCompleted(event);
          break;
        case 'payment_intent.succeeded':
          await this.createTransaction(event);
          break;
        case 'payment_intent.created':
          await this.createTransaction(event);
          break;
        case 'charge.succeeded ':
          await this.createTransaction(event);
          break;
        case 'charge.refunded':
          await this.handlerChargeRefunded(event);
          break;
        default:
          await this.createTransaction(event);
      }
    } catch (error) {
      throw error;
    }
  }

  async handlerChargeRefunded(event): Promise<void> {
    const { amount_refunded, payment_intent } = event.data.object;
    await Promise.all([
      this.paymentInfoModel.findOneAndUpdate({ payment_intent_id: payment_intent }, { amount_refunded }),
      this.createTransaction(event),
    ]);
  }

  async handlerCheckOutSessionCompleted(event: CheckoutSession): Promise<void> {
    const eventId = event.id;
    const { livemode, pending_webhooks, type } = event;
    const sectionInput = event.data.object;
    const sessionInputId = sectionInput.id;

    const session = await this.stripeConfig.checkout.sessions.retrieve(sessionInputId);
    if (!session) {
      throw new BadRequestException(httpErrors.PAYMENT_SESSION_NOT_FOUND);
    }

    const { id, payment_intent, created } = session;
    // create payment info
    const paymentInfo = await this.paymentInfoModel.findOneAndUpdate(
      { session_id: id },
      {
        event_id: eventId,
        payment_intent_id: payment_intent,
        status: PaymentStatus.SUCCEEDED,
      },
    );

    // create transaction
    const paymentTransaction = new PaymentTransaction();
    paymentTransaction.event_id = eventId;
    paymentTransaction.created = new Date(created * 1000);
    paymentTransaction.livemode = livemode;
    paymentTransaction.pending_webhooks = pending_webhooks;
    paymentTransaction.event_id = type;
    paymentTransaction.event_info = JSON.stringify(event);
    paymentTransaction.payment_info_id = paymentInfo.id;
    paymentTransaction.type = type;

    await this.paymentTransactionModel.create(paymentTransaction);
  }

  async createTransaction(event: CheckoutSession): Promise<void> {
    const { id, created, livemode, pending_webhooks, type } = event;

    const paymentTransaction = new PaymentTransaction();
    paymentTransaction.event_id = id;
    paymentTransaction.created = new Date(created * 1000);
    paymentTransaction.livemode = livemode;
    paymentTransaction.pending_webhooks = pending_webhooks;
    paymentTransaction.type = type;
    paymentTransaction.event_info = JSON.stringify(event);

    await this.paymentTransactionModel.create(paymentTransaction);
  }

  async getSessionInfo(sessionId: string): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return this.stripeConfig.checkout.sessions.retrieve(sessionId);
  }

  async getPaymentIntentInfo(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripeConfig.paymentIntents.retrieve(paymentIntentId);
  }

  async checkPaymentDetail(payment_info_id: string): Promise<any> {
    return this.getPaymentInfoById(payment_info_id);
  }
}
