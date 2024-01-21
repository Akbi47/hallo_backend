import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceInfo, ServiceInfoDocument } from '../schemas/service-info.schema';

@Injectable()
export class ProductInfoRepository {
  constructor(@InjectModel(ServiceInfo.name) private serviceInfoInfoModel: Model<ServiceInfoDocument>) {}
}
