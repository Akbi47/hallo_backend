import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  Put,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ClientAuth, UserAuth } from 'src/shares/decorators/http.decorators';
import { OrderService } from './order.service';
import { GetClientOrderDto, GetClientOrderHistoryDto, GetOrderDto } from './dto/get-orders.dto';
import { Order } from './schemas/order.schema';

import { CreateOrderDtoAdmin, CreateOrderDtoClient } from './dto/create-order.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserRole } from 'src/shares/enums/user.enum';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import {
  AddOrderLine,
  CancelOrder,
  ChangeBulkStatus,
  ChangeStatus,
  ReconfirmOrder,
  updateOrderDto,
  updateShippingInfoDto,
} from './dto/update-order.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('my-order')
  @ApiBearerAuth()
  @ClientAuth()
  @ApiOperation({ summary: `Client Get order` })
  async getClientOrder(@UserID() userId: string, @Query() query: GetClientOrderDto): Promise<ResPagingDto<Order[]>> {
    return this.orderService.getClientOrder(userId, query);
  }

  @Get()
  @ApiOperation({ summary: `[Admin] Get all order` })
  async find(@Body() dto: GetOrderDto): Promise<ResPagingDto<Order[]>> {
    return this.orderService.find(dto);
  }

  @Post('/client')
  @ApiOperation({ summary: 'Client create order' })
  @ApiBearerAuth()
  @ClientAuth()
  async clientCreate(@Body() createOrderDto: CreateOrderDtoClient, @UserID() clientId: string): Promise<void> {
    await this.orderService.clientCreateOrder(createOrderDto, clientId);
  }

  @Get('/client/my-order')
  @ApiOperation({ summary: 'Client create order' })
  @ApiBearerAuth()
  @ClientAuth()
  async clientGetOrderHistory(
    @Query() query: GetClientOrderHistoryDto,
    @UserID() clientId: string,
  ): Promise<ResPagingDto<Order[]>> {
    return this.orderService.clientHistory(query, clientId);
  }

  @Get('/admin/:id')
  @ApiOperation({ summary: '[ ADMIN ] get  order' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async adminGetOrdrDetail(@Param() { id }: IdDto): Promise<void> {
    return this.orderService.getOrderById(id);
  }

  @Post('export-excel')
  @ApiOperation({ summary: 'Export excel service info' })
  async exportFileExcel(@Body() dto: GetOrderDto, @Res() res: Response): Promise<void> {
    return this.orderService.exportFileExcel(dto, res);
  }

  @Post('/admin')
  @ApiOperation({ summary: '[ ADMIN ] create order' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async adminCreate(@Body() createOrderDto: CreateOrderDtoAdmin): Promise<void> {
    await this.orderService.adminCreateOrder(createOrderDto);
  }

  // todo user can delete order when status order  ==?
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete order by id' })
  @ApiBearerAuth()
  @ClientAuth()
  async deleteCart(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.orderService.deleteById(param.id, userId);
  }

  // todo user can delete order when status order  ==?
  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete order by admin ' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async deleteByAdmin(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.orderService.deleteByAdmin(param.id, userId);
  }

  // todo user can add order when status order  ==?
  @Put('order-line/:id')
  @ApiOperation({ summary: 'add  order line by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async addOrderLine(
    @Param() param: IdDto,

    @Body() orderLine: AddOrderLine,
    @UserID() userId: string,
  ): Promise<void> {
    await this.orderService.addOrderLineById(param.id, orderLine, userId);
  }

  // todo user can add order when status order  ==?
  @Put('status/:id')
  @ApiOperation({ summary: 'update status by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async updateStatus(@Param() param: IdDto, @Body() status: ChangeStatus, @UserID() userId: string): Promise<void> {
    await this.orderService.changeStatusById(param.id, status, userId);
  }

  // todo user can add order when status order  ==?
  @Put('status')
  @ApiOperation({ summary: 'update status by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async updateBulkStatus(@Body() dto: ChangeBulkStatus, @UserID() userId: string): Promise<void> {
    await this.orderService.changeStatus(dto, userId);
  }

  // todo user can add order when status order  ==?
  @Put('step1/:id')
  @ApiOperation({ summary: 'update step1 by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async updateStep1(@Param() param: IdDto, @Body() dto: updateOrderDto, @UserID() userId: string): Promise<void> {
    await this.orderService.updateById(param.id, dto, userId);
  }

  // todo user can add order when status order  ==?
  @Put('cancel/:id')
  @ApiOperation({ summary: 'update step1 by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async cancelOrder(@Param() param: IdDto, @Body() dto: CancelOrder, @UserID() userId: string): Promise<void> {
    await this.orderService.cancelOrder(param.id, dto, userId);
  }

  // todo user can add order when status order  ==?
  @Put('reconfirm/:id')
  @ApiOperation({ summary: 'update step1 by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async reconfirmOrder(@Param() param: IdDto, @Body() dto: ReconfirmOrder, @UserID() userId: string): Promise<void> {
    await this.orderService.reconfirmOrder(param.id, dto, userId);
  }

  // todo user can add order when status order  ==?
  @Put('shipping/:id')
  @ApiOperation({ summary: 'update shipping info by order id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async updateShippingOrder(
    @Param() param: IdDto,
    @Body() dto: updateShippingInfoDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.orderService.updateShippingInfoById(param.id, dto, userId);
  }

  @Post('import-excel')
  @ApiOperation({ summary: 'Import excel product info' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Excel file',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @UserID() userId: string,
  ): Promise<void> {
    return this.orderService.importFileExcel(file, res, userId);
  }
}
