import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefundHikariService } from './refund-hikari.service';
import { CreateRefundHiakriDto } from './dto/client-create-refund.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { OrderHikariIdDto } from './dto/get-refund.dto';

@ApiTags('Refund Hikari')
@Controller('refund-hikari')
export class RefundHikariController {
  constructor(private refundHikariService: RefundHikariService) {}
  @Get('/:order_hikari_id')
  @ApiOperation({ summary: `Get detail one refund hikari` })
  @ApiBearerAuth()
  @UserAuth()
  async findDetail(@Param() param: OrderHikariIdDto): Promise<any> {
    return await this.refundHikariService.findDetail(param.order_hikari_id);
  }

  @Post()
  @ApiOperation({ summary: 'User create refund' })
  @ApiBearerAuth()
  async createRefund(@Body() createRefundHikariDto: CreateRefundHiakriDto): Promise<void> {
    await this.refundHikariService.createRefund(createRefundHikariDto);
  }
}
