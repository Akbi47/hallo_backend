import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { PushNotificationDto } from './dto/push-notification.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Firebase')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post()
  async sendPushNotification(@Body() pushNotificationDto: PushNotificationDto) {
    const { token, title, body } = pushNotificationDto;
    await this.firebaseService.sendPushNotification(token, title, body);
    return { message: 'Push notification sent successfully' };
  }
}
