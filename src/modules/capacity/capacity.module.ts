import { Module } from '@nestjs/common';
import { CapacityController } from './capacity.controller';
import { CapacityService } from './capacity.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Capacity, CapacitySchema } from './schemas/capacity.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Capacity.name, schema: CapacitySchema }])],
  controllers: [CapacityController],
  providers: [CapacityService],
})
export class CapacityModule {}
