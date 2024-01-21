import { Controller, Post, Patch, Body, Param, Get, Query, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShippingMethodService } from './shipping-method.service';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { GetShippingMethodDto } from './dto/get-shipping-method.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { ShippingMethod } from './schemas/shipping-method.schema';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpDateShippingMethodDto } from './dto/update-shipping-method.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('ShippingMethod')
@Controller('shipping-method')
export class ShippingMethodController {
  constructor(private shippingMethodService: ShippingMethodService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shipping' })
  async finds(@Query() query: GetShippingMethodDto): Promise<ResPagingDto<ShippingMethod[]>> {
    return this.shippingMethodService.find(query);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create shipping' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async create(@Body() createShippingMethodDto: CreateShippingMethodDto, @UserID() userId: string): Promise<void> {
    await this.shippingMethodService.createShippingMethod(createShippingMethodDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ ADMIN ] update ShippingMethod by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async update(
    @Param() param: IdDto,
    @Body() UpdateShippingMethodDto: UpDateShippingMethodDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.shippingMethodService.updateShippingMethod(param.id, UpdateShippingMethodDto, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many ShippingMethod info' })
  async deleteServiceInfos(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.shippingMethodService.deleteIds(body.ids, userId);
  }
}
