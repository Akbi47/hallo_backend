import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gift, GiftDocument } from './schemas/gift.schema';
import { Model } from 'mongoose';
import { GetGiftDto } from './dto/get-gift.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { httpErrors } from 'src/shares/exceptions';

@Injectable()
export class GiftService {
  constructor(@InjectModel(Gift.name) private giftModel: Model<GiftDocument>) {}

  async find(getGiftDto: GetGiftDto): Promise<ResPagingDto<Gift[]>> {
    const { sort, page, limit, name } = getGiftDto;
    const query: any = {};
    query.deleted = false;

    if (name) {
      query.name = name;
    }

    const [result, total] = await Promise.all([
      this.giftModel
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.giftModel.find(query).countDocuments(),
    ]);

    return {
      result,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  async createGift(createShippingDto: CreateGiftDto, create_by: string): Promise<void> {
    await this.giftModel.create({
      ...createShippingDto,
      histories: [{ create_by, info: JSON.stringify(createShippingDto), created_at: new Date() }],
    });
  }

  async updateGift(_id: string, payload: UpdateGiftDto, update_by: string): Promise<void> {
    const gift = await this.giftModel.findOne({ _id });
    if (!gift) {
      throw new BadRequestException(httpErrors.SHIPPING_NOT_FOUND);
    }
    payload['histories'] = [
      ...(gift?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    await this.giftModel.findOneAndUpdate({ _id }, payload);
  }

  async deleteIds(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const gift = await this.giftModel.findById(id);

        if (!gift) {
          throw new BadRequestException(httpErrors.PRODUCT_INFO_NOT_FOUND);
        }

        const histories = [...(gift?.histories || []), { delete_by, created_at: new Date() }];

        await this.giftModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }
}
