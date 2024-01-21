import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule, Logger, Module } from '@nestjs/common';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { getConfig } from 'src/configs';
import { MailProcessor } from 'src/modules/mail/job/mail.processor';
import { MailConsole } from 'src/modules/mail/mail.console';
import { MailService } from 'src/modules/mail/mail.service';
import * as config from 'config';
import * as redisStore from 'cache-manager-redis-store';
import { redisConfig } from 'src/configs/redis.config';

const mailHost = config.get<number>('mail.host');
const mailPort = config.get<number>('mail.port');
const mailAccount = config.get<number>('mail.account');
const mailPassword = config.get<number>('mail.password');
const mailFrom = getConfig().get<string>('mail.from');
const isQueueEnabled = true;

const bullOptions = {
  name: 'mail',
};
if (!isQueueEnabled) {
  bullOptions['processors'] = [];
}

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: mailHost,
        port: mailPort,
        secure: false, // true for 465, false for other ports
        auth: {
          user: mailAccount,
          pass: mailPassword,
        },
      },
      defaults: {
        from: `"No Reply" <${mailFrom}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.registerQueue(bullOptions),
    CacheModule.register({
      store: redisStore,
      ...redisConfig,
      isGlobal: true,
    }),
  ],
  providers: [MailService, MailProcessor, MailConsole, Logger],
  exports: [MailService],
})
export class MailModule {}
