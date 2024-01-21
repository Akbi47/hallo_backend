import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Home, HomeDocument } from './schemas/home.schema';
import { Model } from 'mongoose';
import { CreateHomeDto } from './dto/create-home.dto';
import { UpdateHomeDto } from './dto/update-home.dto';
import { httpErrors } from 'src/shares/exceptions';

@Injectable()
export class HomeService {
  constructor(@InjectModel(Home.name) private homeModel: Model<HomeDocument>) {}

  async find(): Promise<Home> {
    return this.homeModel.findOne();
  }

  async createHome(payload: CreateHomeDto): Promise<void> {
    await this.homeModel.create({
      ...payload,
    });
  }

  async updateHome(payload: UpdateHomeDto): Promise<void> {
    const home = await this.homeModel.findOne();
    if (!home) {
      throw new BadRequestException(httpErrors.HOME_NOT_FOUND);
    }

    await this.homeModel.findOneAndUpdate({}, payload);
  }
}
