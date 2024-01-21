import { Controller, Post, Patch, Body, Param, Get, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { IdDto } from 'src/shares/dtos/param.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { GetTypeDto } from './dto/get-type.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Type as TypeSchema } from './schemas/type.schema';
import { TypeService } from './type.service';
import { Response } from 'express';
@ApiTags('Type')
@Controller('type')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  @ApiOperation({ summary: 'Get Type and calculate product sale' })
  async getType(@Query() query: GetTypeDto): Promise<ResPagingDto<TypeSchema[]>> {
    return this.typeService.getType(query);
  }

  @Get('/product')
  @ApiOperation({ summary: 'Get Type and product in type' })
  async getTypeProduct(@Query() query: GetTypeDto): Promise<ResPagingDto<TypeSchema[]>> {
    return this.typeService.findTypeProduct(query);
  }

  @Get('/service-info')
  @ApiOperation({ summary: 'Get type and service info' })
  async getServiceInfoByType(@Query() query: GetTypeDto): Promise<ResPagingDto<TypeSchema[]>> {
    return this.typeService.findTypeAndServiceInfo(query);
  }

  @Get('/product-info')
  @ApiOperation({ summary: 'Get type and product info' })
  async getProductInfoByType(@Query() query: GetTypeDto): Promise<ResPagingDto<TypeSchema[]>> {
    return this.typeService.findTypeAndProductInfo(query);
  }

  @Get('/info')
  @ApiOperation({ summary: 'Get Type' })
  async getTypeInfo(@Query() query: GetTypeDto): Promise<ResPagingDto<TypeSchema[]>> {
    return this.typeService.find(query);
  }

  @Get('export-excel')
  @ApiOperation({ summary: 'Get product of type' })
  async exportFileExcel(@Query() query: GetTypeDto, @Res() res: Response): Promise<void> {
    return this.typeService.exportFileExcel(query, res);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] Create Type' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async createType(@Body() createCapacityDto: CreateTypeDto): Promise<void> {
    await this.typeService.createType(createCapacityDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[ ADMIN ] Update Type' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async updateType(@Param() param: IdDto, @Body() updateTypeDto: UpdateTypeDto): Promise<void> {
    await this.typeService.updateType(param.id, updateTypeDto);
  }
}
