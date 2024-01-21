import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './schema/contracts.schema';
import { Model } from 'mongoose';
import { GetContractDto } from './dto/get-contract.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractService {
  constructor(@InjectModel(Contract.name) private contractModel: Model<ContractDocument>) {}

  async createContract(payload: CreateContractDto): Promise<Contract> {
    return this.contractModel.create(payload);
  }

  async find(getUnitDto: GetContractDto): Promise<ResPagingDto<Contract[]>> {
    const { sort, page, limit, id, name } = getUnitDto;
    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const [result, total] = await Promise.all([
      this.contractModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.contractModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async updateContract(id: string, payload: UpdateContractDto): Promise<void> {
    const contract = await this.contractModel.findById(id);
    if (!contract) {
      throw new BadRequestException();
    }
    await this.contractModel.findOneAndUpdate({ _id: id }, payload);
  }
}
