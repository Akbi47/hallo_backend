import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Requests, RequestsSchema } from './schemas/request.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Requests.name, schema: RequestsSchema }])],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
