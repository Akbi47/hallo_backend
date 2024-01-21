import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ExcelService } from './excel.service';
import * as fs from 'fs';

@ApiTags('Excel')
@Controller('excel')
export class ExcelController {
  constructor(private excelService: ExcelService) {}

  @Get('download-example/service-info/telecom')
  @ApiOperation({ summary: 'Get file excel service info example' })
  async dowServiceInfo(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/nhapthongtin-dichvuvienthong.xlsx';
    const fileName = 'nhapthongtin-dichvuvienthong.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }

  @Get('download-example/product/service-info')
  @ApiOperation({ summary: 'Get file excel product service info example' })
  async dowServiceTelecomInfo(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/nhapkho-dichvuchung.xlsx';
    const fileName = 'nhapkho-dichvuchung.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }

  @Get('download-example/product-info')
  @ApiOperation({ summary: 'Get file excel product info example' })
  async dowExampleImportProductInfo(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/nhapthongtin-sanpham.xlsx';
    const fileName = 'nhapthongtin-sanpham.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }

  @Get('download-example/product/service-telecom')
  @ApiOperation({ summary: 'Get file excel product service telecom example' })
  async dowExampleImportProductServiceTelecom(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/nhapkho-dichvuvienthong.xlsx';
    const fileName = 'nhapkho-dichvuvienthong.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }

  @Get('download-example/product/service')
  @ApiOperation({ summary: 'Get file excel product service example' })
  async dowExampleImportProductService(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/nhapkho-dichvuchung.xlsx';
    const fileName = 'nhapkho-dichvuchung.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }

  @Get('download-example/product')
  @ApiOperation({ summary: 'Get file excel product example' })
  async dowExampleImportProduct(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/nhapkho-sanpham.xlsx';
    const fileName = 'nhapkho-sanpham.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }

  @Get('download-example/service-info')
  @ApiOperation({ summary: 'Get file excel service info example' })
  async dowExampleImportServiceInfo(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/nhapthongtin-dichvuchung.xlsx';
    const fileName = 'nhapthongtin-dichvuchung.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }

  @Get('download-example/supplier')
  @ApiOperation({ summary: 'Get file excel supplier example' })
  async dowExampleImportSupplier(@Res() res: Response): Promise<void> {
    const filePath = 'src/modules/excel/file/template.nhap-nhacungcap.xlsx';
    const fileName = 'template.nhap-nhacungcap.xlsx';
    const fileBuffer = fs.readFileSync(filePath);

    res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.set('Content-Disposition', `attachment; filename=${fileName}`);

    res.send({ buffer: fileBuffer });
  }
}
