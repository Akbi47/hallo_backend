export class MapServiceInfoDto {
  _id: string;
  name: string;
  code: string;
  buy_type: string;
  capacity_name: string;
  capacity_id: string;
  producer_id: string;
  producer_name: string;
  service_production_location: string;
  type_service_name: string;
  type_service_id: string;
  type_service_use_id: string;
  type_service_use_name: string;
  contract_name: string;
  contract_id: string;
  service_group_name: string;
  service_group_id: string;
  desc: string;
  image_url: string[];
  other_fees: {
    name: string;
    price: string;
  }[];
  selling_fee: {
    unit_name: string;
    unit_id: string;
    price: string;
  };
  selling_info: {
    deposit: string;
    activation_fee: string;
    network_opening_fee: string;
    other_fee: string;
    total: string;
  };
  producer_info: {
    producer: {
      _id: string;
      name: string;
      code: string;
      phone: string;
      address: string;
      policy: string;
    };
    service_production_location: string;
  };
  histories: any[];
  currency_unit_id: string;
  currency_unit_name: string;
  status: string;
  createdAt: string;
  attributes: [{ name?: string; value?: string }];
}
