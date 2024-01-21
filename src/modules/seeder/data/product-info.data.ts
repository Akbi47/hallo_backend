import { ExchangeType } from 'src/shares/enums/exchange.enum';
import { ProductStatusEnum } from 'src/shares/enums/product.enum';

export const productInfoData = [
  {
    status: ProductStatusEnum.ACTIVE,
    name: 'Vé máy bay',
    code: 'UZIXAF',
    desc: '',
    producer_info: {
      product_production_location: 'Viet Nam',
    },
    default_selling_price: 2000,
    attributes: [
      {
        name: 'thuộc tính 1',
        value: '1111111',
      },
      {
        name: 'thuộc tính 2',
        value: '222222',
      },
      {
        name: 'thuộc tính 3',
        value: '3333333333',
      },
      {
        name: 'thuộc tính 4',
        value: '444444',
      },
    ],
    selling_exchanges: [
      {
        price: 2000,
        exchange_type: ExchangeType.eq,
        quantity: 200,
        unit_id: '',
      },
    ],
    image_url: ['https://vja-ui.useleadr.com/uploads/1920x450_T_and_C_fare_7da69b0f32.png'],
    currency: 'JPY',
  },
];
