export class ConvertServiceInfoInputDto {
  code: string;
  type_service_name: string;
  name: string;
  buy_type_input: string;
  service_group_name: string;
  type_service_use_name: string;
  unit_name: string;
  attributes_input: string;
  currency_unit_name: string;
  service_charges_input: string;
  desc: string;
  producer_info: {
    producer_name: string;
    service_production_location: string;
  };
  selling_exchanges_input: string;
  default_selling_price: string;
  selling_fee: {
    price: string;
    unit_name: string;
  };
  status_input: string;
  row: number;
}
