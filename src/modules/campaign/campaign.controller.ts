import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { CampaignService } from './campaign.service';
import { UserRole } from 'src/shares/enums/user.enum';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { GetCampaignDto } from './dto/get-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { MapCampaignDto } from './dto/map-campaign.dto';

@ApiTags('Campaign')
@Controller('campaign')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Get()
  @ApiOperation({ summary: 'Get campaign' })
  async get(@Param() getCampaign: GetCampaignDto): Promise<ResPagingDto<MapCampaignDto[]>> {
    return this.campaignService.findCampaign(getCampaign);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create campaign' })
  async create(@Body() payload: CreateCampaignDto, @UserID() userId: string): Promise<void> {
    await this.campaignService.createCampaign(payload, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update campaign by id' })
  async update(@Param() { id }: IdDto, @Body() payload: UpdateCampaignDto, @UserID() userId: string): Promise<void> {
    await this.campaignService.updateCampaign(id, payload, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many campaign info' })
  async deletes(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.campaignService.deleteCampaigns(body.ids, userId);
  }
}
