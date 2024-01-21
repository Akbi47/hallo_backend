import { Controller, Post, Patch, Delete, Body, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { UserRole } from 'src/shares/enums/user.enum';
import { DeviceService } from './device.service';
import { IdDto } from 'src/shares/dtos/param.dto';
import { GetDriveDto } from './dto/get-device.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Device } from './schemas/device.schema';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get()
  @ApiOperation({ summary: `[ ADMIN ] get device` })
  async find(@Query() query: GetDriveDto): Promise<ResPagingDto<Device[]>> {
    return this.deviceService.find(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create device' })
  async createDevice(@Body() createDeviceDto: CreateDeviceDto, @UserID() userId: string): Promise<void> {
    await this.deviceService.createDevice(userId, createDeviceDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update device by id' })
  async updateDevice(
    @Param() param: IdDto,
    @Body() updateDeviceDto: UpdateDeviceDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.deviceService.updateDevice(param.id, updateDeviceDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[ ADMIN ] delete device by id' })
  async deleteDevice(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.deviceService.deleteDevice(param.id, userId);
  }
}
