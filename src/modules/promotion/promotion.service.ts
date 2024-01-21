import { Injectable, BadRequestException } from '@nestjs/common';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { httpErrors } from 'src/shares/exceptions';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { GetPromotion } from './dto/get-promotion.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { sortHistories } from 'src/shares/helpers/utils';
import { Group, GroupDocument } from '../group/schemas/group.schema';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { ShippingMethod, ShippingMethodDocument } from '../shipping-method/schemas/shipping-method.schema';

@Injectable()
export class PromotionService {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
    @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
    @InjectModel(ShippingMethod.name) private shippingMethodModel: Model<ShippingMethodDocument>,
  ) {}

  async find(getPromotion: GetPromotion): Promise<ResPagingDto<Promotion[]>> {
    const { sort, page, limit } = getPromotion;
    const query = this.buildQuery(getPromotion);

    const populatePromotion = this.getPopulate();

    const [result, total] = await Promise.all([
      this.promotionModel
        .find(query)
        .populate(populatePromotion)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.promotionModel.find(query).countDocuments(),
    ]);

    return {
      result: this.mapPromotion(result),
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  getPopulate(): any {
    return [
      {
        path: 'promotional_group_id',
        model: this.groupModel,
        select: '-__v  -deleted',
      },
      {
        path: 'currency_unit_id',
        model: this.unitModel,
        select: '-__v  -deleted',
      },
      {
        path: 'product_condition',
        populate: [{ path: 'shipping_method_id', model: this.shippingMethodModel, select: '-__v  -deleted' }],
      },
    ];
  }

  mapPromotion(promotions: Promotion[]): any {
    return promotions.map((productInfo: any) => {
      const product_condition = productInfo?.product_condition;
      const promo_info = productInfo?.promo_info;
      return {
        _id: productInfo?.id,
        type_apply_discount: productInfo?.type_apply_discount?.toString(),
        promotional_group_id: productInfo?.promotional_group_id?._id,
        promotional_group_name: productInfo?.promotional_group_id?.name,
        name: productInfo?.name,
        code: productInfo?.code,
        currency_unit_id: productInfo?.currency_unit_id?._id,
        currency_unit_name: productInfo?.currency_unit_id?.name,
        product_condition: {
          subjects_to_apply: product_condition?.subjects_to_apply,
          shipping: product_condition?.shipping_method_id,
          number_of_times_applier: product_condition?.number_of_times_applier,
          applicable_products: product_condition?.applicable_products,
          start_date: product_condition?.start_date,
          end_date: product_condition?.end_date,
          total_order_value_from: product_condition?.total_order_value_from.toString(),
          total_order_value_to: product_condition?.total_order_value_to.toString(),
        },
        promo_info: {
          bill_discount_percent: promo_info?.bill_discount_percent?.toString(),
          discount_delivery_percent: promo_info?.discount_delivery_percent?.toString(),
          discount_delivery_value: promo_info?.discount_delivery_value?.toString(),
          start_date: promo_info?.start_date,
          end_date: promo_info?.end_date,
        },
        gifts: productInfo?.gifts,
        image_url: productInfo?.image_url,
        histories: sortHistories(productInfo?.histories || []),
        desc: productInfo?.desc,
        status: productInfo?.status,
      };
    });
  }

  buildQuery(param: GetPromotion): any {
    const {
      status,
      id,
      name,
      code,
      subjects_to_apply,
      start_date,
      end_date,
      total_order_value_from,
      total_order_value_to,
    } = param;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (id) {
      query._id = id;
    }

    if (code) {
      query.code = code;
    }

    if (subjects_to_apply) {
      query.product_condition.subjects_to_apply = subjects_to_apply;
    }

    if (start_date) {
      query.product_condition.start_date = { $gt: start_date };
    }

    if (end_date) {
      query.product_condition.total_order_value_from = { $gt: total_order_value_from };
    }

    if (start_date) {
      query.product_condition.total_order_value_to = { $gt: total_order_value_to };
    }

    return query;
  }

  async createPromotion(payload: CreatePromotionDto, create_by: string): Promise<void> {
    await this.promotionModel.create({
      ...payload,
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async updatePromotion(_id: string, payload: UpdatePromotionDto, update_by: string): Promise<void> {
    const promotion = await this.promotionModel.findOne({ _id });
    if (!promotion) {
      throw new BadRequestException(httpErrors.PROMOTION_NOT_FOUND);
    }
    payload['histories'] = [
      ...(promotion?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    await this.promotionModel.findOneAndUpdate({ _id }, payload);
  }

  async deletePromotions(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const promotions = await this.promotionModel.findById(id);

        if (!promotions) {
          throw new BadRequestException(httpErrors.PROMOTION_NOT_FOUND);
        }

        const histories = [...(promotions?.histories || []), { delete_by, created_at: new Date() }];

        await this.promotionModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }
}
