import { HistoriesInterface } from 'src/shares/interface/histories.interface';

export class MapCampaignDto {
  _id?: string;
  name?: string;
  code?: string;
  promotional_group_name?: string;
  currency_unit_id?: string;
  currency_unit_name?: string;
  subjects_to_apply?: number;
  status?: string;
  type_applicable_product?: number;
  applicable_products?: string[];
  campaign_type?: number;
  reduction_amount?: number;
  refund_amount?: number;
  image_url?: string;
  desc?: string;
  histories?: HistoriesInterface[];
}
