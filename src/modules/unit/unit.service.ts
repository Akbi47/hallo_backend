import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Unit, UnitDocument } from './schema/unit.schema';
import { CreateUnitDto } from './dto/create-unit.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetUnitDto } from './dto/get-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(@InjectModel(Unit.name) private unitModel: Model<UnitDocument>) {}

  async createUnit(createUnitDto: CreateUnitDto): Promise<Unit> {
    return this.unitModel.create(createUnitDto);
  }

  async find(getUnitDto: GetUnitDto): Promise<ResPagingDto<Unit[]>> {
    const { sort, page, limit, id, name } = getUnitDto;
    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const [result, total] = await Promise.all([
      this.unitModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.unitModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async updateUnit(id: string, payload: UpdateUnitDto): Promise<void> {
    const unit = await this.unitModel.findById(id);
    if (!unit) {
      throw new BadRequestException();
    }
    await this.unitModel.findOneAndUpdate({ _id: id }, payload);
  }
}
