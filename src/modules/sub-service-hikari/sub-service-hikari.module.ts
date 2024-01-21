import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SubServiceHikari, SubServiceHikariSchema } from './schemas/sub-service-hikari.schema'
import { SubServiceHikariController } from './sub-service-hikari.controller'
import { SubServiceHikariService } from './sub-service-hikari.service'
import { ParamsHikari, ParamsHikariSchema } from '../params-hikari/schemas/params-hikari.schema'
import { ServiceHikari, ServiceHikariSchema } from '../service-hikari/schemas/service-hikari.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubServiceHikari.name, schema: SubServiceHikariSchema },
      { name: ServiceHikari.name, schema: ServiceHikariSchema },
      { name: ParamsHikari.name, schema: ParamsHikariSchema },
    ]),
  ],
  controllers: [SubServiceHikariController],
  providers: [SubServiceHikariService],
})
export class SubServiceHikariModule {}
