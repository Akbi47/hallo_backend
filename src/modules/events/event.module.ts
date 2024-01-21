import { Module } from '@nestjs/common';
import { EventGateway } from 'src/modules/events/event.gateway';
import { UsersModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [UsersModule, AuthModule, MessageModule],
  providers: [EventGateway],
})
export class EventModule {}
