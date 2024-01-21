import * as redisStore from 'cache-manager-redis-store'

import { CacheModule, Logger } from '@nestjs/common'

import { BullModule } from '@nestjs/bull'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { ConsoleModule } from 'nestjs-console'
import { mongodb } from 'src/configs/database.config'
import { redisConfig } from 'src/configs/redis.config'
import { EventModule } from 'src/modules/events/event.module'
import { HelloKafka } from 'src/modules/hello-kafka/hello-kafka.module'
import { HttpClientModule } from 'src/shares/http-clients/http.module'
import { KafkaModule } from 'src/shares/kafka-client/kafka-module'
import { AttributesModule } from './modules/attributes/attributes.module'
import { AuthModule } from './modules/auth/auth.module'
import { CapacityModule } from './modules/capacity/capacity.module'
import { CartModule } from './modules/cart/cart.module'
import { CategoriesModule } from './modules/categories/categories.module'
import { ClientModule } from './modules/client/client.module'
import { ContractModule } from './modules/contract/contract.module'
import { DepartmentModule } from './modules/department/department.module'
import { DeviceModule } from './modules/device/device.module'
import { ExcelModule } from './modules/excel/excel.module'
import { GroupModule } from './modules/group/group.module'
import { MailModule } from './modules/mail/mail.module'
import { MessageModule } from './modules/message/message.module'
import { OrderModule } from './modules/order/order.module'
import { ParamModule } from './modules/param/param.module'
import { PaymentTransactionModule } from './modules/payment-transaction/payment-transaction.module'
import { PermissionModule } from './modules/permission/permission.module'
import { ProducerModule } from './modules/producer/producer.module'
import { ProductInfoModule } from './modules/product-info/product-info.module'
import { ProductModule } from './modules/product/product.module'
import { PromotionModule } from './modules/promotion/promotion.module'
import { SeederModule } from './modules/seeder/seeder.module'
import { ServiceInfoModule } from './modules/service-info/service-info.module'
import { ShippingMethodModule } from './modules/shipping-method/shipping-method.module'
import { SupplierModule } from './modules/supplier/supplier.module'
import { TypeUseModule } from './modules/type-use/type-use.module'
import { TypeModule } from './modules/type/type.module'
import { UnitModule } from './modules/unit/unit.module'
import { UploadModule } from './modules/upload/upload.module'
import { UsersModule } from './modules/user/user.module'
import { StripeModule } from './modules/stripe/stripe.module'
import { GiftModule } from './modules/gift/gift.module'
import { CampaignModule } from './modules/campaign/campaign.module'
import { FirebaseModule } from './modules/firebase/firebase.module'
import { HomeModule } from './modules/home/home.module'
import { FeedbackModule } from './modules/feedback/feedback.module'
import { ParamsHikariModule } from './modules/params-hikari/params-hikari.module'
import { OrderHikariModule } from './modules/order-hikari/order-hikari.module'
import { ServiceHikariModule } from './modules/service-hikari/service-hikari.module'
import { SourceModule } from './modules/source/source.module'
import { RefundHikariModule } from './modules/refund-hikari/refund-hikari.module'
import { RequestModule } from './modules/request/request.module'
import { SubServiceHikariModule } from './modules/sub-service-hikari/sub-service-hikari.module'
import { PaymentModule } from './modules/payment/payment.module'
import { AddressShippingModule } from './modules/address-shipping/address-shipping.module'
import { WarrantyModule } from './modules/warranty/warranty.module'

const Modules = [
  Logger,
  MongooseModule.forRoot(mongodb.uri, mongodb.options),
  ScheduleModule.forRoot(),
  KafkaModule,
  ConsoleModule,
  HttpClientModule,
  BullModule.forRoot({
    redis: redisConfig,
  }),
  CacheModule.register({
    store: redisStore,
    ...redisConfig,
    isGlobal: true,
  }),
  EventModule,
  AuthModule,
  HelloKafka,
  UploadModule,
  UsersModule,
  MailModule,
  MessageModule,
  CategoriesModule,
  OrderModule,
  ProductInfoModule,
  CartModule,
  PromotionModule,
  DeviceModule,
  SupplierModule,
  ServiceInfoModule,
  ParamModule,
  PaymentTransactionModule,
  AttributesModule,
  ClientModule,
  ShippingMethodModule,
  UnitModule,
  ContractModule,
  CapacityModule,
  TypeModule,
  ExcelModule,
  SeederModule,
  DepartmentModule,
  SourceModule,
  GroupModule,
  TypeUseModule,
  ProductModule,
  ProducerModule,
  PermissionModule,
  StripeModule,
  GiftModule,
  CampaignModule,
  FirebaseModule,
  HomeModule,
  FeedbackModule,
  ParamsHikariModule,
  OrderHikariModule,
  ServiceHikariModule,
  RequestModule,
  RefundHikariModule,
  SubServiceHikariModule,
  PaymentModule,
  AddressShippingModule,
  WarrantyModule
  
]
export default Modules
