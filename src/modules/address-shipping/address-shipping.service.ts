import { Injectable } from '@nestjs/common';
import { CreateAddressShippingDto } from './dto/create-address-shipping.dto';
import { UpdateAddressShippingDto } from './dto/update-address-shipping.dto';
import { AddresShippingMethodDocument, AddressShippingMethod } from './schemas/address-shipping.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetAddressShippingMethodDto } from './dto/get-addressShipping.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class AddressShippingService {

  constructor(@InjectModel(AddressShippingMethod.name) private addressShippingMethodModel: Model<AddresShippingMethodDocument>) {}

  async create(createAddressShippingDto: CreateAddressShippingDto) {
    await this.addressShippingMethodModel.create(createAddressShippingDto);
  }

  async findAll(getPaymentMethodDto: GetAddressShippingMethodDto): Promise<ResPagingDto<AddressShippingMethod[]>> {
    const { sort, page, limit, name } = getPaymentMethodDto;
    const query: any = {};
    query.deleted = false;

    if (name) {
      query.name = name;
    }

    const [result, total] = await Promise.all([
      this.addressShippingMethodModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.addressShippingMethodModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  

  findOne(id: number) {
    return `This action returns a #${id} addressShipping`;
  }

  update(id: number, updateAddressShippingDto: UpdateAddressShippingDto) {
    return `This action updates a #${id} addressShipping`;
  }

  remove(id: number) {
    return `This action removes a #${id} addressShipping`;
  }
}
