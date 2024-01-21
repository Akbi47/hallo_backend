export enum HikariEnum {
  typeContract = 'typeContract',
  service = 'service',
  timeContact = 'timeContact',
  statusCustomer = 'statusCustomer',
  reasonDelete = 'reasonDelete',
}

export enum HikariLanguageEnum {
  tieng_viet = 0,
  tieng_nhat = 1,
  tieng_anh = 2,
}

export enum TypeContractEnum {
  khong_tu_gia_han = 0,
  gia_han = 1,
}

export enum TimeContactEnum {
  '8h - 12h' = 0,
  '12h - 14h' = 1,
  '14h - 16h' = 2,
  '16h - 18h' = 3,
  '18h - 20h' = 4,
  '19h - 21h' = 5,
  '20h - 21h' = 6,
  'AnyTime' = 7,
}

export enum StatusEnum {
  da_len_don = 0,
  cho_dia_chi = 1,
  can_xu_ly_lai = 2,
  da_len_ho_so = 3,
  cho_xu_ly_ho_so = 4,
  huy_ho_so = 5,
  da_huy_don = 6,
  ho_tro_wifi_dung_tam = 7,
  da_tra_wifi_dung_tam = 8,
  dang_su_dung = 9,
  dung_hop_dong = 10,
}
