export class lineItemDto {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images?: string[];
    };
    unit_amount?: number;
  };
  quantity: number;
}
