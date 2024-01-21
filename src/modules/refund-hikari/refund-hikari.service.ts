import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRefundHiakriDto } from './dto/client-create-refund.dto';
import { RefundHikari, RefundHikariDocument } from './schemas/refund-hikari.schema';

@Injectable()
export class RefundHikariService {
  constructor(
    @InjectModel(RefundHikari.name)
    private refundHikariModel: Model<RefundHikariDocument>,
  ) {}

  async createRefund(createOrderHikariDto: CreateRefundHiakriDto): Promise<any> {
    await this.refundHikariModel.create(createOrderHikariDto);
  }

  async findDetail(id: string): Promise<any> {
    return await this.refundHikariModel.find({ order_hiakri_id: id });
  }
}
