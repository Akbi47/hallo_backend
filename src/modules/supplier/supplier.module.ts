import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { Type } from 'class-transformer';
import { TypeSchema } from '../type/schemas/type.schema';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: Type.name, schema: TypeSchema },
    ]),

    ExcelModule,
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
