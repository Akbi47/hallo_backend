import { Product } from 'src/modules/product/schemas/product.schema';

export class SellingInfoDTO {
  deposit: string;
  activation_fee: string;
  network_opening_fee: string;
  other_fee: string;
  total: string;
}

export class SellingFeeDTO {
  unit_name: string;
  unit_id: string;
  price: string;
}

export class ResFormatServiceInfoDto {
  name: string;
  buy_type: string;
  service_group_name: string;
  capacity_name: string;
  contract_name: string;
  producer_name: string;
  selling_info: SellingInfoDTO;
  selling_fee: SellingFeeDTO;
  products: Product[];
  total: number;
  lastPage: number;
}
