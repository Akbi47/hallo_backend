export class ConvertServiceInfoTelecomInputDto {
  code?: any;
  type_service_name?: any;
  name?: any;
  buy_type_input?: any;
  service_group_name?: any;
  capacity_name?: any;
  contract_name?: any;
  type_service_use_name?: any;
  attributes_input?: any;
  currency_unit_name?: any;
  other_fees_input?: any;
  desc?: any;
  producer_info?: {
    producer_name?: any;
    service_production_location?: any;
  };
  selling_info?: {
    deposit?: any;
    activation_fee?: any;
    network_opening_fee?: any;
    other_fee?: any;
    total?: any;
  };
  selling_fee?: {
    price?: any;
    unit_name?: any;
  };
  status_input?: any;
  row: any;
}
