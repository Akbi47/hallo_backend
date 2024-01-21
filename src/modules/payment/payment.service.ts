import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentMethod, PaymentMethodDocument } from './schemas/payment-method.schema';
import { Model } from 'mongoose';
import { GetPaymentMethodDto } from './dto/get-payment.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(PaymentMethod.name) private paymentMethodModel: Model<PaymentMethodDocument>) {}

  async create(createPaymentDto: CreatePaymentDto) {
    await this.paymentMethodModel.create(createPaymentDto);
  }

  async find(getPaymentMethodDto: GetPaymentMethodDto): Promise<ResPagingDto<PaymentMethod[]>> {
    const { sort, page, limit, name } = getPaymentMethodDto;
    const query: any = {};
    query.deleted = false;

    if (name) {
      query.name = name;
    }

    const [result, total] = await Promise.all([
      this.paymentMethodModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.paymentMethodModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
