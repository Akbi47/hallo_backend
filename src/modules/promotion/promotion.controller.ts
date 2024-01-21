import { Controller, Post, Patch, Delete, Body, Param, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { GetPromotion } from './dto/get-promotion.dto';
import { Promotion } from './schemas/promotion.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';

@ApiTags('Promotion')
@Controller('promotion')
export class PromotionController {
  constructor(private promotionService: PromotionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all promotion and paging' })
  async findAll(@Query() query: GetPromotion): Promise<ResPagingDto<Promotion[]>> {
    return this.promotionService.find(query);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create promotion' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async create(@Body() payload: CreatePromotionDto, @UserID() userId: string): Promise<void> {
    await this.promotionService.createPromotion(payload, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ ADMIN ] update promotion by id' })
  @ApiBearerAuth()
  async update(
    @Param() { id }: IdDto,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.promotionService.updatePromotion(id, updatePromotionDto, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many promotion by ids' })
  async deletes(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.promotionService.deletePromotions(body.ids, userId);
  }
}
