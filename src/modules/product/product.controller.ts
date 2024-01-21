import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MapProductDto } from './dto/map-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get('suggest')
  @ApiOperation({ summary: '[MOBILE] Get all product_line(or service_line) and count number sold' })
  async findProductHome(@Query() query: GetProductDto): Promise<ResPagingDto<any[]>> {
    return this.productService.findAndCountSold(query);
  }

  @Get('suggest/:id')
  @ApiOperation({ summary: '[MOBILE] Get product_line(or service_line) by id' })
  async findProductSuggest(@Param() { id }: IdDto): Promise<any> {
    return this.productService.getInfoProductSuggestById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all product' })
  async find(@Query() query: GetProductDto): Promise<ResPagingDto<MapProductDto[]>> {
    return this.productService.find(query);
  }

  @Get('infos')
  @ApiOperation({ summary: '[MOBILE] Get list  product info and service info( to show all product in client)' })
  async findProductInfo(@Query() query: GetProductDto): Promise<ResPagingDto<MapProductDto[]>> {
    return this.productService.findProductInfo(query);
  }

  @Get('infos/:id')
  @ApiOperation({ summary: '[MOBILE] Get detail of one product info and service info' })
  async findProductInfoById(@Param() { id }: IdDto): Promise<ResPagingDto<MapProductDto[]>> {
    return this.productService.findProductInfoById(id);
  }

  @Get('export-excel')
  @ApiOperation({ summary: 'Get all service info' })
  async exportFileExcel(@Query() query: GetProductDto, @Res() res: Response): Promise<void> {
    return this.productService.exportFileExcel(query, res);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  async findProductById(@Param() { id }: IdDto): Promise<MapProductDto> {
    return this.productService.findProductById(id);
  }

  @Post('import-excel/service-telecom')
  @ApiOperation({ summary: 'Import excel product service telecom' })
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
  async importServiceTelecom(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @UserID() userId: string,
  ): Promise<void> {
    return this.productService.importExcelServiceTelecom(file, res, userId);
  }

  @Post('import-excel/service')
  @ApiOperation({ summary: 'Import excel  service' })
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
  async importService(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @UserID() userId: string,
  ): Promise<void> {
    return this.productService.importExcelService(file, res, userId);
  }

  @Post('import-excel/product')
  @ApiOperation({ summary: 'Import excel product ' })
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
  async importProduct(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @UserID() userId: string,
  ): Promise<void> {
    return this.productService.importExcelProduct(file, res, userId);
  }

  @Post()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] create product' })
  async createProduct(@Body() body: CreateProductDto, @UserID() userId: string): Promise<void> {
    await this.productService.createProduct(body, userId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] update product by id' })
  async updateProduct(@Param() param: IdDto, @Body() body: UpdateProductDto, @UserID() userId: string): Promise<void> {
    await this.productService.updateProduct(param.id, body, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many product by ids' })
  async deleteProducts(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.productService.deleteProducts(body.ids, userId);
  }
}
