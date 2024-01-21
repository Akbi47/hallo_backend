export const data = [
  {
    name: 'service 2',
    code: '11111',
    type: 'monthly',
    saihakko_fee: 10001,
    producer_info: {
      supplier_id: '',
      service_production_location: 'Ha Noi',
    },
    other_fee: [
      {
        name: 'chi phí khác 1',
        price: 4444,
      },
      {
        name: 'chi phí khác 2',
        price: 1111,
      },
      {
        name: 'chi phí khác 3',
        price: 2222,
      },
    ],

    buying_fee: {
      unit_id: '',
      price: 1000,
    },

    selling_fee: {
      unit_id: '',
      price: 2000,
    },

    buying_info: {
      deposit: 1000,
      activation_fee: 2000,
      network_opening_fee: 3000,
      extra_sim_fee: 4000,
      other_fee: 5000,
      total: 15000,
    },
    selling_info: {
      deposit: 1000,
      activation_fee: 2000,
      network_opening_fee: 3000,
      extra_sim_fee: 4000,
      other_fee: 5000,
      total: 15000,
    },
    image_url: [
      'anh-meo-cute-doi-mu-long-tai-tho-600x600.jpg',
      'anh-meo-cute-doi-mu-long-tai-tho-600x600.jpg',
      'hinh-meo-Tai-Cup-de-thuong-nhat-720x620.jpg',
      'avatar-meo-cute-4.jpg',
      'Anh-meo-ngau.jpg',
    ],
    desc: 'đây là miêu tả của service 1',
    currency: 'JPY',
    imei: '07032767386',
    iccid: '0981200291974441682',
    start_date_active: new Date(),
    end_date_active: new Date(),
  },
];
