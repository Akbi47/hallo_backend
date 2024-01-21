export class Histories {
  create_by?: string;
  update_by?: string;
  delete_by?: string;
  info?: string;
  created_at: Date;
}

export class ConvertProductServiceDto {
  iccid: string;
  code: string;
  supplier_name: string;
  service_name: string;
  buy_type_input: string;
  service_group_name: string;
  unit_name: string;
  import_date: string;
  contract_expire_date: string;
  producer_name: string;
  currency_unit_name: string;
  buying_price: string;
  service_charges_input: string;
  buying_fee: {
    price: string;
    unit_name: string;
  };
  active_date: string;
  inactive_date: string;
  status_input: string;
  desc: string;
  row: number;
}
