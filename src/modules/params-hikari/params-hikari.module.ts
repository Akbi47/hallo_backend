import { Module } from '@nestjs/common';
import { ParamsHikariService } from './params-hikari.service';
import { ParamsHikariController } from './params-hikari.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ParamsHikari, ParamsHikariSchema } from './schemas/params-hikari.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ParamsHikari.name, schema: ParamsHikariSchema }])],
  controllers: [ParamsHikariController],
  providers: [ParamsHikariService],
})
export class ParamsHikariModule {}
