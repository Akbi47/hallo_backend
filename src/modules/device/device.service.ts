import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device, DeviceDocument } from './schemas/device.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { httpErrors } from 'src/shares/exceptions';
import { GetDriveDto } from './dto/get-device.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { sortHistories } from 'src/shares/helpers/utils';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async find(getDriveDto: GetDriveDto): Promise<ResPagingDto<Device[]>> {
    const { sort, page, limit, id, name, currency } = getDriveDto;
    const query: any = {};

    if (id) {
      query._id = id;
    }

    if (currency) {
      query.currency = currency;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    const [result, total] = await Promise.all([
      this.deviceModel
        .find(query)
        .populate([
          {
            path: 'histories',
            populate: [
              { path: 'update_by', model: this.userModel, select: '-__v  -deleted' },
              { path: 'delete_by', model: this.userModel, select: '-__v  -deleted' },
              { path: 'create_by', model: this.userModel, select: '-__v  -deleted' },
            ],
          },
        ])
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: sort }),
      this.deviceModel.find(query).countDocuments(),
    ]);

    const devices = this.mapDevice(result);

    return {
      result: devices,
      total,
      lastPage: Math.ceil(total / limit),
    };
  }

  private mapDevice(devices: Device[]): any[] {
    return devices.map((device: any) => {
      return {
        _id: device?.id,
        name: device?.name,
        status: device?.status,
        desc: device?.desc,
        buying_price: device?.buying_price.toString(),
        selling_price: device?.selling_price.toString(),
        histories: sortHistories(device?.histories || []),
        currency: device?.currency,
        deleted: device?.deleted,
        createdAt: device?.createdAt,
      };
    });
  }

  async createDevice(create_by: string, payload: CreateDeviceDto): Promise<void> {
    await this.deviceModel.create({
      ...payload,
      histories: [{ create_by, info: JSON.stringify(payload), created_at: new Date() }],
    });
  }

  async updateDevice(_id: string, updateDeviceDto: UpdateDeviceDto, update_by: string): Promise<Device> {
    const device = await this.deviceModel.findOne({ _id });
    if (!device) {
      throw new BadRequestException(httpErrors.DEVICE_NOT_FOUND);
    }

    updateDeviceDto['histories'] = [
      ...(device?.histories || []),
      { update_by, info: JSON.stringify(updateDeviceDto), created_at: new Date() },
    ];

    return await this.deviceModel.findOneAndUpdate({ _id }, updateDeviceDto, { new: true });
  }

  async deleteDevice(_id: string, delete_by: string): Promise<void> {
    const device = await this.deviceModel.findById(_id);
    if (!device) {
      throw new BadRequestException(httpErrors.DEVICE_NOT_FOUND);
    }
    const histories = [...(device?.histories || []), { delete_by, created_at: new Date() }];

    await this.deviceModel.findOneAndUpdate({ _id }, { deleted: true, histories });
  }
}
