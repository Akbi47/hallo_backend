import { Controller, Post, Patch, Get, Body, Param, Query, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamService } from './param.service';
import { Param as _Param } from './schemas/param.schema';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { CreateParamDto } from './dto/create-param.dto';
import { UpdateParamDto } from './dto/update-param.dto';
import { GetParamDto, GetParamInfoDto } from './dto/get-param.dto';
import { IdDto } from 'src/shares/dtos/param.dto';

@ApiTags('Param')
@Controller('param')
export class ParamController {
  constructor(private paramService: ParamService) { }
  @Get('/info-all')
  @ApiOperation({ summary: 'Get info all param' })
  async getInfoAllParams(): Promise<_Param> {
    return this.paramService.getInfoAllParams();
  }

  @Get('/info')
  @ApiOperation({ summary: 'Get info param' })
  async getInfoParam(@Query() query: GetParamInfoDto): Promise<_Param> {
    return this.paramService.getInfoParam(query);
  }

  @Get('/promotion')
  @ApiOperation({ summary: 'Get info param promotion' })
  async getParamPromotion(): Promise<_Param> {
    return this.paramService.getParamPromotion();
  }

  @Get()
  @ApiOperation({ summary: 'Get param' })
  async getParam(@Query() query: GetParamDto): Promise<any> {
    return this.paramService.findOne(query);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({
    summary: '[ ADMIN ] create param',
    description: 'Get trade history',
  })
  async createParam(@Body() createParamDto: CreateParamDto): Promise<void> {
    await this.paramService.createParam(createParamDto);
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update param' })
  async updateParam(@Param() param: IdDto, @Body() updateParamDto: UpdateParamDto): Promise<void> {
    await this.paramService.updateParam(param.id, updateParamDto);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete param' })
  async deleteParam(@Param() param: IdDto): Promise<void> {
    await this.paramService.deleteParam(param.id);
  }
}
