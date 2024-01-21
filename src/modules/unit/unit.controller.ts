import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Unit } from './schema/unit.schema';
import { GetUnitDto } from './dto/get-unit.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UserRole } from 'src/shares/enums/user.enum';

@ApiTags('Unit')
@Controller('unit')
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Get()
  @ApiOperation({ summary: `Get all unit and paging` })
  async find(@Query() query: GetUnitDto): Promise<ResPagingDto<Unit[]>> {
    return this.unitService.find(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] Create new unit' })
  async create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return this.unitService.createUnit(createUnitDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] Update unit by id' })
  async update(@Param() param: IdDto, @Body() updateUserDto: UpdateUnitDto): Promise<void> {
    await this.unitService.updateUnit(param.id, updateUserDto);
  }
}
