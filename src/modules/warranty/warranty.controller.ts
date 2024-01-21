import { Body, Controller, Delete, Get, Param, Put, Post, Query} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { IdDto } from 'src/shares/dtos/param.dto';
import { GetWarrantyDto } from './dto/get-warranties.dto';
import { CreateWarrantyDto } from './dto/create-warranties.dto';
// import { Response } from 'express'
import { UserRole } from 'src/shares/enums/user.enum';
// import { UserID } from 'src/shares/decorators/get-user-id.decorator'
// import { FileInterceptor } from '@nestjs/platform-express'
import { WarrantyService } from './warranty.service';
import { UpdateWarrantyDto } from './dto/update-warranties.dto';
import { GetClientDto } from './dto/get-client-info.dto';

@ApiTags('Warranty')
@Controller('warranty')
export class WarrantyController {
  constructor(private warrantyService: WarrantyService) {}

  @Get('/')
  @ApiOperation({ summary: `Get warranty` })
  // @ApiBearerAuth()
  // @UserAuth()
  async find(@Query() query: GetWarrantyDto): Promise<any> {
    return await this.warrantyService.find(query);
  }

  @Get('/client-info')
  @ApiOperation({ summary: `Get client info by ID/ICCID/IMEI belong to client` })
  // @ApiBearerAuth()
  // @UserAuth()
  async findClient(@Query() query: GetClientDto): Promise<any> {
    return await this.warrantyService.findClient(query);
  }

  @Get('/service-name')
  @ApiOperation({ summary: `Get service name by ID/ICCID/IMEI belong to client` })
  // @ApiBearerAuth()
  // @UserAuth()
  async findServiceName(@Query() query: GetClientDto): Promise<any> {
    return await this.warrantyService.findServiceName(query);
  }

  @Get('/link-pancake')
  @ApiOperation({ summary: `Get client infos by link pancake` })
  // @ApiBearerAuth()
  // @UserAuth()
  async findClientByLinkPancake(@Query('link_pancake') link_pancake: string): Promise<any> {
    return await this.warrantyService.findClientByLinkPancake(link_pancake);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get warranty by id' })
  // @ApiBearerAuth()
  // @UserAuth([UserRole.admin])
  async findById(@Param() param: IdDto  ): Promise<void> {
    return await this.warrantyService.findById(param.id);
  }


  @Put('/:id')
  @ApiOperation({ summary: 'Update warranty by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async update(@Body() args: UpdateWarrantyDto , @Param() param: IdDto  ): Promise<void> {
    return await this.warrantyService.update(args, param);
  }


  @Post()
  @ApiOperation({ summary: 'Create warranty' })
  // @ApiBearerAuth()
  // @UserAuth([UserRole.tu_van_vien])
  async create(@Body() warrantyDto: CreateWarrantyDto): Promise<void> {
    await this.warrantyService.create(warrantyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete warranty by id' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  async delete(@Param() param: IdDto): Promise<void> {
    await this.warrantyService.delete(param.id);
  }

}
