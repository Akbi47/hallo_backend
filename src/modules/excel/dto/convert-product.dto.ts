export class Histories {
  create_by?: string;
  update_by?: string;
  delete_by?: string;
  info?: string;
  created_at: Date;
}

export class ConvertProductDto {
  product_type_name: string;
  ID: string;
  imei: string;
  iccid: string;
  code: string;
  supplier_name: string;
  service_name: string;
  service_group_name: string;
  unit_name: string;
  import_date: string;
  inactive_date: string;
  producer_name: string;
  currency_unit_name: string;
  buying_price: string;
  status_input: string;
  desc: string;
  row: number;
}
