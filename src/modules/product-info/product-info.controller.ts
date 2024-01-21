import {
  Controller,
  Get,
  Post,
  Param,
  Patch,
  Query,
  Body,
  Delete,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductInfoDto } from './dto/get-product-info.dto';
import { ProductInfoService } from './product-info.service';
import { UpdateProductInfoDto } from './dto/update-product-info.dto';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { CreateProductInfoDto } from './dto/create-product-info.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { MapProductInfoDto } from './dto/map-product-info.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Product Info')
@Controller('product-info')
export class ProductInfoController {
  constructor(private productInfoService: ProductInfoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all product info and paging' })
  async findAll(@Query() query: GetProductInfoDto): Promise<ResPagingDto<MapProductInfoDto[]>> {
    return this.productInfoService.find(query);
  }

  @Get('export-excel')
  @ApiOperation({ summary: 'Get excel product info' })
  async exportFileExcel(@Query() query: GetProductInfoDto, @Res() res: Response): Promise<void> {
    return this.productInfoService.exportFileExcel(query, res);
  }

  @Post('import-excel')
  @ApiOperation({ summary: 'Import excel product info' })
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Excel file',
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @UserID() userId: string,
  ): Promise<void> {
    return this.productInfoService.importFileExcel(file, res, userId);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create new product info' })
  async create(@Body() createProductDto: CreateProductInfoDto, @UserID() userId: string): Promise<void> {
    return this.productInfoService.createProductInfo(createProductDto, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] Update product info by id' })
  async update(
    @Param() param: IdDto,
    @Body() updateUserDto: UpdateProductInfoDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.productInfoService.findByIdAndUpDate(param.id, updateUserDto, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete product info by id' })
  async deleteProductInfo(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.productInfoService.deleteById(param.id, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many product info' })
  async deleteServiceInfos(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.productInfoService.deleteIds(body.ids, userId);
  }
}
