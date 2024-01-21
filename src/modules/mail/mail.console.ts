import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import * as config from 'config';
import { Command, Console } from 'nestjs-console';
import { MailService } from 'src/modules/mail/mail.service';
const mailFrom = config.get<number>('mail.from');

@Console()
@Injectable()
export class MailConsole {
  constructor(
    private mailerService: MailerService,
    private readonly mailService: MailService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(MailConsole.name);
  }

  @Command({
    command: 'send-mail <email> <subject> <body>',
    description: 'Send test email',
  })
  async sendMail(email: string, subject: string, body: string): Promise<void> {
    await this.mailerService.sendMail({
      from: `"No Reply" <${mailFrom}>`,
      to: email,
      subject: 'Pet - Notification',
      template: 'src/modules/mail/templates/sign-up.hbs',
      context: {
        email,
        code: '123456',
        title: subject,
        message: body,
      },
    });
  }
}
