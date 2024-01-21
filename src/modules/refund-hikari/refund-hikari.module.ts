import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExcelModule } from '../excel/excel.module';
import { RefundHikariController } from './refund-hikari.controller';
import { RefundHikariService } from './refund-hikari.service';
import { RefundHikari, RefundHikariSchema } from './schemas/refund-hikari.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: RefundHikari.name, schema: RefundHikariSchema }]), ExcelModule],
  controllers: [RefundHikariController],
  providers: [RefundHikariService],
})
export class RefundHikariModule {}
