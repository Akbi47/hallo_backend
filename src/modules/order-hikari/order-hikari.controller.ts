import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { UserAuth } from 'src/shares/decorators/http.decorators'
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto'
import { CreateOrderHiakriDto } from './dto/client-create-order.dto'
import { UpdateOrderHiakriDto } from './dto/client-update-order.dto'
import { GetOrderDto } from './dto/get-orders.dto'
import { OrderHikariService } from './order-hikari.service'
import { Response } from 'express'
import { UserRole } from 'src/shares/enums/user.enum'
import { UserID } from 'src/shares/decorators/get-user-id.decorator'
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('Order Hikari')
@Controller('hikari-order')
export class OrderHikariController {
  constructor(private orderHikariService: OrderHikariService) {}

  @Get()
  @ApiOperation({ summary: `Get all order hikari` })
  @ApiBearerAuth()
  @UserAuth()
  async find(@Query() query: GetOrderDto): Promise<any> {
    return await this.orderHikariService.find(query)
  }

  @Get('export-excel')
  @ApiOperation({ summary: 'Get excel orders' })
  @ApiBearerAuth()
  @UserAuth()
  async exportFileExcel(@Query() query: GetOrderDto, @Res() res: Response): Promise<any> {
    return await this.orderHikariService.exportFileExcel(query, res)
  }

  @Post('import-excel')
  @ApiOperation({ summary: 'Import excel order hikari' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '',
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
  async importExcelServiceInfo(@UploadedFile() file: Express.Multer.File, @Res() res: Response, @UserID() userId: string): Promise<void> {
    return this.orderHikariService.importFileExcel(file, res, userId)
  }

  @Get('/:id')
  @ApiOperation({ summary: `Get detail one order hikari` })
  @ApiBearerAuth()
  @UserAuth()
  async findDetail(@Param() param: IdDto): Promise<any> {
    return await this.orderHikariService.findDetail(param.id)
  }

  @Post()
  // @ApiOperation({ summary: 'User create order' })
  // @ApiBearerAuth()
  // @UserAuth([UserRole.tu_van_vien])
  async createOrder(@Body() createOrderHikariDto: CreateOrderHiakriDto): Promise<void> {
    await this.orderHikariService.createOrder(createOrderHikariDto)
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'User update order' })
  @ApiBearerAuth()
  @UserAuth()
  async updateOrder(@Body() updateOrderHikariDto: UpdateOrderHiakriDto): Promise<void> {
    await this.orderHikariService.updateOrder(updateOrderHikariDto)
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.tu_van_vien])
  @ApiOperation({ summary: 'delete many order by ids' })
  async deleteOrders(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.orderHikariService.deleteHikariOrders(body.ids, userId)
  }
}
