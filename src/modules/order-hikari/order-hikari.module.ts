import { Module } from '@nestjs/common'
import { OrderHikariService } from './order-hikari.service'
import { MongooseModule } from '@nestjs/mongoose'
import { OrderHikari, OrderHikariSchema } from './schemas/order-hikari.schema'
import { OrderHikariController } from './order-hikari.controller'
import { ParamsHikari, ParamsHikariSchema } from '../params-hikari/schemas/params-hikari.schema'
import { User, UserSchema } from '../user/schemas/user.schema'
import { Client, ClientSchema } from '../client/schemas/client.schema'
import { ServiceHikari, ServiceHikariSchema } from '../service-hikari/schemas/service-hikari.schema'
import { ExcelModule } from '../excel/excel.module'
import { SubServiceHikari, SubServiceHikariSchema } from '../sub-service-hikari/schemas/sub-service-hikari.schema'
import { ExcelOrderHikariService } from '../excel/excel-order-hikari.service'
import { Source, SourceSchema } from '../source/schemas/source.schema'
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderHikari.name, schema: OrderHikariSchema },
      { name: ParamsHikari.name, schema: ParamsHikariSchema },
      { name: ServiceHikari.name, schema: ServiceHikariSchema },
      { name: SubServiceHikari.name, schema: SubServiceHikariSchema },
      { name: User.name, schema: UserSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Source.name, schema: SourceSchema },
    ]),
    ExcelModule,
  ],
  controllers: [OrderHikariController],
  providers: [OrderHikariService, ExcelOrderHikariService],
})
export class OrderHikariModule {}
