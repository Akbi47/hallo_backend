import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { Model } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { GetFeedbackDto } from './dto/get-feedback.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>) {}

  async find(getShippingDto: GetFeedbackDto): Promise<ResPagingDto<Feedback[]>> {
    const { sort, page, limit, title } = getShippingDto;
    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const [result, total] = await Promise.all([
      this.feedbackModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.feedbackModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Feedback> {
    return this.feedbackModel.findOne({ _id: id });
  }

  async create(payload: CreateFeedbackDto, create_by: string): Promise<void> {
    await this.feedbackModel.create({ ...payload, client_id: create_by });
  }
}
