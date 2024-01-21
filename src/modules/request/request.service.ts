import { Injectable } from '@nestjs/common';
import { GetRequestDto } from './dto/get-request.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Requests, RequestsDocument } from './schemas/request.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestService {
  constructor(@InjectModel(Requests.name) private requestsModel: Model<RequestsDocument>) {}

  async find(getShippingDto: GetRequestDto): Promise<ResPagingDto<Requests[]>> {
    const { sort, page, limit, title } = getShippingDto;
    const query: any = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    const [result, total] = await Promise.all([
      this.requestsModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.requestsModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<Requests> {
    return this.requestsModel.findOne({ _id: id });
  }

  async create(payload: CreateRequestDto, create_by: string): Promise<void> {
    await this.requestsModel.create({ ...payload, client_id: create_by });
  }
}
