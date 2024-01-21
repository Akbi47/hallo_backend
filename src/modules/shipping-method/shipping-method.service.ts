import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ShippingMethod, ShippingMethodDocument } from './schemas/shipping-method.schema';
import { Model } from 'mongoose';
import { GetShippingMethodDto } from './dto/get-shipping-method.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpDateShippingMethodDto } from './dto/update-shipping-method.dto';
import { httpErrors } from 'src/shares/exceptions';

@Injectable()
export class ShippingMethodService {
  constructor(@InjectModel(ShippingMethod.name) private shippingMethodModel: Model<ShippingMethodDocument>) {}

  async find(getShippingMethodDto: GetShippingMethodDto): Promise<ResPagingDto<ShippingMethod[]>> {
    const { sort, page, limit, name } = getShippingMethodDto;
    const query: any = {};
    query.deleted = false;

    if (name) {
      query.name = name;
    }

    const [result, total] = await Promise.all([
      this.shippingMethodModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.shippingMethodModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createShippingMethod(createShippingMethodDto: CreateShippingMethodDto, create_by: string): Promise<void> {
    await this.shippingMethodModel.create({
      ...createShippingMethodDto,
      histories: [{ create_by, info: JSON.stringify(createShippingMethodDto), created_at: new Date() }],
    });
  }

  async updateShippingMethod(_id: string, payload: UpDateShippingMethodDto, update_by: string): Promise<void> {
    const ShippingMethod = await this.shippingMethodModel.findOne({ _id });
    if (!ShippingMethod) {
      throw new BadRequestException(httpErrors.SHIPPING_METHOD_NOT_FOUND);
    }

    payload['histories'] = [
      ...(ShippingMethod?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    await this.shippingMethodModel.findOneAndUpdate({ _id }, payload);
  }

  async deleteIds(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const shippingMethod = await this.shippingMethodModel.findById(id);

        if (!shippingMethod) {
          throw new BadRequestException(httpErrors.PRODUCT_INFO_NOT_FOUND);
        }

        const histories = [...(shippingMethod?.histories || []), { delete_by, created_at: new Date() }];

        await this.shippingMethodModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }
}
