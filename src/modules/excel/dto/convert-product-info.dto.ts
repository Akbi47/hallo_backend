export class ConvertProductInfoInputDto {
  code?: any;
  product_type_name?: any;
  name?: any;
  group_name?: any;
  type_product_use_name?: any;
  unit_name?: any;
  attributes_input?: any;
  currency_unit_name?: any;
  desc?: any;
  producer_info?: {
    producer_name: any;
    product_production_location: any;
  };
  selling_exchanges_input?: any;
  selling_fee?: any;
  status_input?: any;
  row?: number;
}
