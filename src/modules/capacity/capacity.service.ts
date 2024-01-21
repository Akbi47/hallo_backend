import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Capacity, CapacityDocument } from './schemas/capacity.schema';
import { Model } from 'mongoose';
import { CreateParamDto } from '../param/dto/create-param.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { httpErrors } from 'src/shares/exceptions';
import { GetCapacityDto } from './dto/get-capacity.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class CapacityService {
  constructor(@InjectModel(Capacity.name) private capacityModel: Model<CapacityDocument>) {}

  async find(getCapacityDto: GetCapacityDto): Promise<ResPagingDto<Capacity[]>> {
    const { sort, page, limit, id, name } = getCapacityDto;
    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const [result, total] = await Promise.all([
      this.capacityModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.capacityModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getCapacities(): Promise<Capacity[]> {
    return this.capacityModel.find();
  }

  async createCapacity(createParamDto: CreateParamDto): Promise<void> {
    await this.capacityModel.create(createParamDto);
  }

  async updateCapacities(_id: string, updateCapacitiesDto: UpdateCapacityDto): Promise<Capacity> {
    const capacity = await this.capacityModel.findOne({ _id });
    if (!capacity) {
      throw new BadRequestException(httpErrors.CAPACITY_NOT_FOUND);
    }
    return await this.capacityModel.findOneAndUpdate({ _id }, updateCapacitiesDto, { new: true });
  }

  async deleteCapacities(_id: string): Promise<void> {
    await this.capacityModel.findOneAndDelete({ _id });
  }
}
