import { Attribute, AttributeDocument } from './schemas/attributes.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetAttributeDto } from './dto/get-attribute.dto';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { httpErrors } from 'src/shares/exceptions';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@Injectable()
export class AttributesService {
  constructor(@InjectModel(Attribute.name) private attributeModel: Model<AttributeDocument>) {}

  async find(getAttributeDto: GetAttributeDto): Promise<ResPagingDto<Attribute[]>> {
    const { sort, page, limit, name, id } = getAttributeDto;
    const query: any = {};

    if (name) {
      query.name = name;
    }

    if (id) {
      query._id = id;
    }

    const [result, total] = await Promise.all([
      this.attributeModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.attributeModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createAttribute(createAttributeDto: CreateAttributeDto): Promise<void> {
    await this.attributeModel.create(createAttributeDto);
  }

  async updateAttribute(_id: string, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
    const attribute = await this.attributeModel.findOne({ _id });
    if (!attribute) {
      throw new BadRequestException(httpErrors.ATTRIBUTE_NOT_FOUND);
    }
    return this.attributeModel.findOneAndUpdate({ _id }, updateAttributeDto, { new: true });
  }

  async deleteAttribute(_id: string, delete_by: string): Promise<void> {
    const attribute = await this.attributeModel.findOne({ _id });
    if (!attribute) {
      throw new BadRequestException(httpErrors.ATTRIBUTE_NOT_FOUND);
    }
    await this.attributeModel.findOneAndUpdate({ _id }, { deleted: true, delete_by }, { new: true });
  }
}
