export class MapProductDto {
  _id: string;
  ID: string;
  status: string;
  name: string;
  code: string;
  deleted: boolean;
  desc: string;
  createdAt: string;
  supplier_id: string;
  supplier_name: string;
  service_info?: any;
  histories: any[];
  imei: string;
  iccid: string;
  import_date: string;
  contract_expire_date: string;
  active_date: string;
  inactive_date: string;
  saihakko_fee: string;
  unit_name: string;
  unit_id: string;
}
