import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ServiceHikari, ServiceHikariSchema } from './schemas/service-hikari.schema'
import { ServiceHikariController } from './service-hikari.controller'
import { ServiceHikariService } from './service-hikari.service'
import { ParamsHikari, ParamsHikariSchema } from '../params-hikari/schemas/params-hikari.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceHikari.name, schema: ServiceHikariSchema },
      { name: ParamsHikari.name, schema: ParamsHikariSchema },
    ]),
  ],
  controllers: [ServiceHikariController],
  providers: [ServiceHikariService],
})
export class ServiceHikariModule {}
