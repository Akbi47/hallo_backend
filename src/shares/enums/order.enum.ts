export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderType {
  EXTEND = 'EXTEND',
  NEW_ORDER = 'NEW_ORDER',
}

export enum DeliveryTime {
  ANY_TIME = 'ANYTIME',
  H8_12 = '8h_12h',
  H12_14 = '12h_14h',
  H14_16 = '14h_16h',
  H16_18 = '16h_18h',
  H18_20 = '18h_20h',
  H19_21 = '19h_21h',
  H20_21 = '20h_21h',
}
export enum PackageShippingStatus {
  NOT_DELIVERED = 'NOT DELIVERED',
  WAIT_RECEIVE = 'WAIT RECEIVE',
  RECEIVED = 'RECEIVED',
  NOT_RECEIVED = 'NOT RECEIVED',
  CANCELED = 'CANCELED',
}

export enum OrderPaymentMethod {
  DAIBIKI = 'DAIBIKI',
  VISA_MASTER_CARD = 'VISA_MASTER_CARD',
  QR_CODE = 'QR_CODE',
  DIRECT = 'DIRECT',
}

export enum OrderPurchaseStatus {
  Potential_Customer = 'Potential_Customer',
  Close_Order = 'Close_Order',
}

export enum ShippingPromotionItemsStatus {
  SHIPPED = 'SHIPPED',
  NOT_SHIPPED = 'NOT_SHIPPED',
}

export enum CancelReason {
  DONT_GIVE_INFORMATION = 'DONT WANT TO GIVE INFORMATION',
  NO_PHONE_NUMBER = 'NO PHONE NUMBER',
  ALREADY_HAS_PROFILE = 'ALREADY HAS A PROFILE ON SB',
  EXPENSIVE = 'EXPENSIVE',
  TIME_CONSUMING = 'TIME_CONSUMING',
  SWITCH_TO_POCKET = 'WANT TO SWITCH TO POCKET',
}

export enum ReconfirmReason {
  DONT_GIVE_INFORMATION = 'DONT WANT TO GIVE INFORMATION',
  NO_PHONE_NUMBER = 'NO PHONE NUMBER',
  ALREADY_HAS_PROFILE = 'ALREADY HAS A PROFILE ON SB',
  EXPENSIVE = 'EXPENSIVE',
  TIME_CONSUMING = 'TIME_CONSUMING',
  SWITCH_TO_POCKET = 'WANT TO SWITCH TO POCKET',
}

export enum OrderWifiTemporarily {
  NOT_RECEIVED = 'NOT_RECEIVED',
  RECEIVED = 'RECEIVED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  FILLED = 'FILLED',
  NEED_RECONFIRMATION = 'NEED RECONFIRMATION',
  CONFIRM_INFORMATION = 'CONFIRM INFORMATION',
  WAITING_FOR_SHIPPING = 'WAITING FOR SHIPPING',
  SCHEDULED_PICKUP = 'SCHEDULED PICKUP',
  SHIPPING = 'SHIPPING',
  SHIPPED = 'SHIPPED',
  // ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  COMPLETE = 'COMPLETE',
  // UNTRIGGERED = 'UNTRIGGERED',
}

export enum OrderStopType {
  STOP_LIMIT = 'STOP_LIMIT',
  STOP_MARKET = 'STOP_MARKET',
  TRAILING_STOP = 'TRAILING_STOP',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
}

export enum OrderTimeInForce {
  GTC = 'GTC',
  IOC = 'IOC',
  FOK = 'FOK',
}

export enum OrderTrigger {
  LAST = 'LAST',
  INDEX = 'INDEX',
  ORACLE = 'ORACLE',
}
