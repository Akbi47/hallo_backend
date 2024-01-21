import { Controller, Post, Body, Patch, Get, Param, Query } from '@nestjs/common';
import { CapacityService } from './capacity.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCapacityDto } from './dto/create-capacity.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UpdateCapacityDto } from './dto/update-capacity.dto';
import { GetCapacityDto } from './dto/get-capacity.dto';
import { Capacity } from './schemas/capacity.schema';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';

@ApiTags('Capacities')
@Controller('capacities')
export class CapacityController {
  constructor(private capacityService: CapacityService) {}

  @Get()
  @ApiOperation({ summary: 'Get capacity' })
  async getParam(@Query() query: GetCapacityDto): Promise<ResPagingDto<Capacity[]>> {
    return this.capacityService.find(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create capacity' })
  async createCapacity(@Body() createCapacityDto: CreateCapacityDto): Promise<void> {
    await this.capacityService.createCapacity(createCapacityDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update capacity' })
  async updateCapacity(@Param() param: IdDto, @Body() updateCapacitiesDto: UpdateCapacityDto): Promise<void> {
    await this.capacityService.updateCapacities(param.id, updateCapacitiesDto);
  }
}
