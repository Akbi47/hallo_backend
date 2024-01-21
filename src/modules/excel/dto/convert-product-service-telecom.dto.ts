export class Histories {
  create_by?: string;
  update_by?: string;
  delete_by?: string;
  info?: string;
  created_at: Date;
}

export class ConvertProductServiceTelecomDto {
  ID?: any;
  name?: any;
  code?: any;
  desc?: any;
  product_info_id?: any;
  service_info_id?: any;
  imei?: any;
  iccid?: any;
  import_date?: any;
  contract_expire_date?: any;
  active_date?: any;
  inactive_date?: any;
  status?: any;
  histories?: Histories;
  saihakko_fee?: any;
  supplier_id?: any;
  buying_info?: any;
  buying_fee?: any;
  service_charges?: any;
  buying_price?: any;
  unit_id?: any;
  currency_unit_id?: any;
  row?: number;
  product_type_name?: any;
  supplier_name?: any;
  service_name?: any;
  buy_type_input?: any;
  service_group_name?: any;
  capacity_name?: any;
  contract_name?: any;
  producer_name?: any;
  status_input?: any;
  currency_unit_name?: any;
}
