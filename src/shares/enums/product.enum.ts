export enum ProductStatusEnum {
  SOLD = 'SOLD',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
  IN_STOCK = 'IN_STOCK', // trong kho
  APPLIED = 'APPLIED', //  đã lên đơn
  SHIPPING = 'SHIPPING', // đang vận chuyển  shipping
  USE = 'USE', // đang sử dụng
  RETURNING = 'RETURNING', // đang đổi trả
  NETWORK_IS_CUT = 'NETWORK_IS_CUT', // đã cắt mạng
  NETWORK_IS_OPEN = 'NETWORK_IS_OPEN', // đã mở mạng
  SAIHAKKO = 'SAIHAKKO', // đang saihakko
  EXPIRED = 'EXPIRED', // hết hạn
  CANCEL_THE_CONTRACT = 'CANCEL_THE_CONTRACT', // hủy hợp đồng
  MAINTAINING = 'MAINTAINING', // đang bảo trì
  HOLD = 'HOLD', // giữ hộ
}

export enum ProductTypeEnum {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
}
