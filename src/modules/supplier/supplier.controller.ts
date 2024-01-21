import {
  Controller,
  Post,
  Patch,
  Body,
  Delete,
  Param,
  Get,
  Res,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserID } from 'src/shares/decorators/get-user-id.decorator';
import { UserAuth } from 'src/shares/decorators/http.decorators';
import { UserRole } from 'src/shares/enums/user.enum';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { IdDto, IdsDto } from 'src/shares/dtos/param.dto';
import { GetSupplierDto } from './dto/get-supplier.dto';
import { ResPagingDto } from 'src/shares/dtos/pagination.dto';
import { Supplier } from './schemas/supplier.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@ApiTags('Supplier')
@Controller('supplier')
@ApiBearerAuth()
@UserAuth([UserRole.admin])
export class SupplierController {
  constructor(private supplierService: SupplierService) {}

  @Get()
  @ApiOperation({ summary: `[ ADMIN ] get supplier` })
  async find(@Query() query: GetSupplierDto): Promise<ResPagingDto<Supplier[]>> {
    return this.supplierService.find(query);
  }

  @Post('import-excel')
  @ApiOperation({ summary: 'Import excel supplier by excel' })
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
  async importExcelServiceInfoTelecom(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
    @UserID() userId: string,
  ): Promise<void> {
    return this.supplierService.importFileExcel(file, res, userId);
  }

  @Post()
  @ApiOperation({ summary: '[ ADMIN ] create supplier' })
  async createSupplier(@Body() createSupplierDto: CreateSupplierDto, @UserID() userId: string): Promise<void> {
    await this.supplierService.createSupplier(createSupplierDto, userId);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '[ ADMIN ] update supplier by id' })
  async updateSupplier(
    @Param() param: IdDto,
    @Body() updateSupplierDto: UpdateSupplierDto,
    @UserID() userId: string,
  ): Promise<void> {
    await this.supplierService.updateSupplier(param.id, updateSupplierDto, userId);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '[ ADMIN ] delete supplier by id' })
  async deleteSupplier(@Param() param: IdDto, @UserID() userId: string): Promise<void> {
    await this.supplierService.deleteSupplier(param.id, userId);
  }

  @Delete()
  @ApiBearerAuth()
  @UserAuth([UserRole.admin])
  @ApiOperation({ summary: '[ ADMIN ] delete many supplier info' })
  async deleteServiceInfos(@Body() body: IdsDto, @UserID() userId: string): Promise<void> {
    await this.supplierService.deleteSuppliers(body.ids, userId);
  }
}
