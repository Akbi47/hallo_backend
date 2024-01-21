import { GroupKeyEnum } from 'src/shares/enums/group.enum';
import { TypeTypeEnum } from 'src/shares/enums/type.enum';

export const serviceGroup = [
  {
    name: 'Viễn thông',
    code: 'SD',
    desc: 'sim này cung cấp data siêu khủng ',
    type: TypeTypeEnum.service,
    img: 'https://hallo-storage.ap-south-1.linodeobjects.com/router%201_2023-09-26T01%3A48%3A19.534Z.svg%2Bxml',
    key: GroupKeyEnum.TELECOM,
  },
  {
    name: 'Game',
    code: 'SC',
    type: TypeTypeEnum.service,
    img:
      'https://hallo-storage.ap-south-1.linodeobjects.com/flash%201%20%281%29_2023-09-26T02%3A15%3A19.736Z.svg%2Bxml',
    key: GroupKeyEnum.GAME,
  },
  {
    name: 'Du lịch',
    code: 'SP',
    type: TypeTypeEnum.service,
    img: 'https://hallo-storage.ap-south-1.linodeobjects.com/receipt%201_2023-09-26T02%3A15%3A55.668Z.svg%2Bxm',
    key: GroupKeyEnum.TRAVEL,
  },
  {
    name: 'Sức khỏe',
    code: 'HK',
    type: TypeTypeEnum.service,
    key: GroupKeyEnum.HEALTH,
    img: 'https://hallo-storage.ap-south-1.linodeobjects.com/voucher%202_2023-09-26T02%3A17%3A03.790Z.svg%2Bxml',
  },
];

export const productGroup = [
  {
    name: 'Đồ ăn',
    code: 'PK',
    type: TypeTypeEnum.service,
    img: 'https://hallo-storage.ap-south-1.linodeobjects.com/drop%201_2023-09-26T01%3A49%3A00.332Z.svg%2Bxml',
    key: GroupKeyEnum.FOOD,
  },
  {
    name: 'Shopping',
    code: 'HK',
    type: TypeTypeEnum.service,
    key: GroupKeyEnum.SHOPPING,
    img:
      'https://hallo-storage.ap-south-1.linodeobjects.com/receipt%201%20%281%29_2023-09-26T02%3A16%3A32.992Z.svg%2Bxml',
  },
];
