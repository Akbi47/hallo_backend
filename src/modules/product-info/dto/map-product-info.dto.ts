import { HistoriesInterface } from 'src/shares/interface/histories.interface';

export class MapProductInfoDto {
  _id: string;
  product_type_id: string;
  product_type_name: string;
  status: string;
  name: string;
  code: string;
  group_name: string;
  group_id: string;
  type_product_use_id: string;
  type_product_use_name: string;
  currency_unit_id: string;
  currency_unit_name: string;
  unit_id: string;
  unit_name: string;
  producer_info: {
    producer_id: string;
    producer_name: string;
    product_production_location: string;
  };
  selling_exchanges: {
    price: string;
    unit_id: string;
    unit_name: string;
    exchange_type: string;
    quantity: string;
  }[];
  default_selling_price: string;
  histories: HistoriesInterface[];
  deleted: boolean;
  image_url: string[];
  desc: string;
  createdAt: string;
  attributes: {
    name: string;
    value: string;
  }[];
}
