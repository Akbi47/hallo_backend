import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as config from 'config';
import { randomCodeNumber } from 'src/shares/helpers/utils';
import { CacheForgotPassword } from '../client/dto/forgot-password.dto';

import { Cache } from 'cache-manager';
import { FORGOT_PASSWORD_CACHE, SIGN_UP_CACHE, SIGN_UP_EXPIRY, FORGOT_PASSWORD_EXPIRY } from '../auth/auth.constants';
import { SignUpCacheInterface, SignUpInterface } from '../client/dto/sign-up.dto';

const mailFrom = config.get<string>('mail.from');

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectQueue('mail') private readonly queue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendForgotPasswordEmailJob(email: string): Promise<void> {
    await this.queue.add('sendForgotPasswordEmail', {
      email,
    });
  }

  async sendForgotPasswordEmail(email: string): Promise<void> {
    const code = randomCodeNumber(6);

    await this.mailerService.sendMail({
      to: email,
      from: `"Support Team" <${mailFrom}>`, // override default from
      subject: 'PET SHOP - RESET PASSWORD',
      template: 'src/modules/mail/templates/forgot-password.hbs', // `.hbs` extension is appended automatically
      context: {
        email,
        code,
        supportEmail: mailFrom,
      },
    });

    const cacheInfo: CacheForgotPassword = {
      code,
      attempt: 0,
    };

    await this.cacheManager.set<string>(`${FORGOT_PASSWORD_CACHE}${email}`, JSON.stringify(cacheInfo), {
      ttl: FORGOT_PASSWORD_EXPIRY,
    });
  }

  async sendSignUpEmailJob(signUpInterface: SignUpInterface): Promise<void> {
    await this.queue.add('sendSignUpEmail', signUpInterface);
  }

  async sendSignUpEmail(signUpInterface: SignUpInterface): Promise<void> {
    const { email, code } = signUpInterface;

    await this.mailerService.sendMail({
      to: email,
      from: `"Support Team" <${mailFrom}>`, // override default from
      subject: 'PET SHOP - NEW SIGN-UP TO EXCLUSIVE ACCESS',
      template: 'src/modules/mail/templates/sign-up.hbs', // `.hbs` extension is appended automatically
      context: {
        email,
        code,
        supportEmail: mailFrom,
      },
    });

    const SignUpInfoCache: SignUpCacheInterface = { ...signUpInterface, attempt: 0 };

    await this.cacheManager.set<string>(`${SIGN_UP_CACHE}${email}`, JSON.stringify(SignUpInfoCache), {
      ttl: SIGN_UP_EXPIRY,
    });
  }
}
