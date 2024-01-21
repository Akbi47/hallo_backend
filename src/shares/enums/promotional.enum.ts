export enum PromotionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum TypeApplyDiscount {
  SINGLE_APPLICATION = 0,
  APPLY_TO_GROUPS = 1,
}

export enum ApplyProductAndService {
  ALL_PRODUCT_AND_SERVICE = 0, // get all product and service
  ALL_PRODUCTS = 1, // get all product
  ALL_SERVICE = 2, // get all service
  CUSTOM = 3, // get list product
}

export enum SubjectsToApply {
  ALL_CUSTOMERS = 0, // all customers
  NO_ORDER_YET = 1, // The customer has not received an order yet
  HAVE_AN_ORDER = 2, // customer has 1 order
  HAVE_MORE_THAN_ONE_ORDER = 3, // Customer has more than 1 order
}

export enum CampaignType {
  DISCOUNT = 0, // Discount
  Refund = 1, // Refund
}
