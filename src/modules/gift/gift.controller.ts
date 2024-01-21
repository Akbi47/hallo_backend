import { Controller, Get, Post, Patch, Query, Body, Param, Delete } from '@nestjs/common';
import { GiftService } from './gift.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetGiftDto } from './dto/get-gift.dto';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { Gift } from './schemas/gift.schema';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';

@ApiTags('Gift')
@Controller('gift')
export class GiftController {
  constructor(private giftService: GiftService) {}

  @Get()
  @ApiOperation({ summary: 'Get all gift' })
  async finds(@Query() query: GetGiftDto): Promise<ResPagingDto<Gift[]>> {
    return this.giftService.find(query);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create gift' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async create(@Body() createShippingDto: CreateGiftDto, @UserID() userId: string): Promise<void> {
    await this.giftService.createGift(createShippingDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ ADMIN ] update gift by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async update(
    @Param() param: IdDto,
    @Body() UpdateShippingDto: UpdateGiftDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.giftService.updateGift(param.id, UpdateShippingDto, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many gift' })
  async deleteServiceInfos(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.giftService.deleteIds(body.ids, userId);
  }
}
