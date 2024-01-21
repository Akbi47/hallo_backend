import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/configs/redis.config';
import { ClientRtStrategy } from './strategies/client-rt.strategy';
import { ClientAtStrategy } from './strategies/client-at.strategy';
import { UsersModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { ClientModule } from '../client/client.module';
import { UserAtStrategy } from './strategies/user-at.strategy';
import { UserRtStrategy } from './strategies/user-rt.strategy';

@Module({
  imports: [
    ClientModule,
    UsersModule,
    JwtModule.register({}),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ClientAtStrategy, ClientRtStrategy, UserAtStrategy, UserRtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
