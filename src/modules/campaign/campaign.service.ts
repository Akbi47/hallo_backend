import { Injectable, BadRequestException } from '@nestjs/common';
import { GetCampaignDto } from './dto/get-campaign.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { Model } from 'mongoose';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Unit, UnitDocument } from '../unit/schema/unit.schema';
import { sortHistories } from 'src/shares/helpers/utils';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { httpErrors } from 'src/shares/exceptions';
import { MapCampaignDto } from './dto/map-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name) private campaignModel: Model<CampaignDocument>,
    @InjectModel(Unit.name) private unitModel: Model<UnitDocument>,
  ) {}

  async findCampaign(param: GetCampaignDto): Promise<ResPagingDto<MapCampaignDto[]>> {
    const { sort, page, limit } = param;
    const query = this.buildQuery(param);

    const populate = this.getPopulate();

    const [result, total] = await Promise.all([
      this.campaignModel
        .find(query)
        .populate(populate)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.campaignModel.find(query).countDocuments(),
    ]);

    return {
      result: this.mapCampaign(result),
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  buildQuery(param: GetCampaignDto): any {
    const { name, code, subjects_to_apply, currency_name, status, type_applicable_product, campaign_type } = param;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (currency_name) {
      query.currency_name = currency_name;
    }

    if (code) {
      query.code = code;
    }

    if (subjects_to_apply) {
      query.product_condition.subjects_to_apply = subjects_to_apply;
    }

    if (type_applicable_product) {
      query.type_applicable_product = type_applicable_product;
    }

    if (campaign_type) {
      query.campaign_type = campaign_type;
    }

    return query;
  }

  getPopulate(): any {
    return [
      {
        path: 'currency_unit_id',
        model: this.unitModel,
        select: '-__v  -deleted',
      },
    ];
  }

  mapCampaign(campaigns: Campaign[]): MapCampaignDto[] {
    return campaigns.map((campaign: any) => {
      const currency_unit = campaign?.currency_unit_id;
      return {
        _id: campaign?.id,
        name: campaign?.name,
        code: campaign?.code,
        promotional_group_name: campaign?.promotional_group_id?.name,
        currency_unit_id: currency_unit?._id,
        currency_unit_name: currency_unit?.name,
        subjects_to_apply: campaign.subjects_to_apply,
        status: campaign?.status,
        type_applicable_product: campaign?.type_applicable_product,
        applicable_products: campaign?.applicable_products,
        campaign_type: campaign?.campaign_type,
        reduction_amount: campaign?.reduction_amount?.toString(),
        refund_amount: campaign?.refund_amounts?.toString(),
        image_url: campaign?.image_url,
        desc: campaign?.desc,
        histories: sortHistories(campaign?.histories || []),
      };
    });
  }
  async createCampaign(payload: CreateCampaignDto, create_by: string): Promise<void> {
    await this.campaignModel.create({
      ...payload,
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async updateCampaign(_id: string, payload: UpdateCampaignDto, update_by: string): Promise<void> {
    const campaign = await this.campaignModel.findOne({ _id });
    if (!campaign) {
      throw new BadRequestException(httpErrors.CAMPAIGN_NOT_FOUND);
    }

    payload['histories'] = [
      ...(campaign?.histories || []),
      { update_by, info: JSON.stringify(payload), created_at: new Date() },
    ];

    await this.campaignModel.findOneAndUpdate({ _id }, payload);
  }

  async deleteCampaigns(ids: string[], delete_by: string): Promise<void> {
    await Promise.all(
      ids.map(async (id) => {
        const campaigns = await this.campaignModel.findById(id);

        if (!campaigns) {
          throw new BadRequestException(httpErrors.CAMPAIGN_NOT_FOUND);
        }

        const histories = [...(campaigns?.histories || []), { delete_by, created_at: new Date() }];

        await this.campaignModel.findOneAndUpdate({ _id: id }, { deleted: true, histories });
      }),
    );
  }
}
