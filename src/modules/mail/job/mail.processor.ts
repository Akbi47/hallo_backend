import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { MailService } from 'src/modules/mail/mail.service';

@Processor('mail')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);
  @Inject(forwardRef(() => MailService))
  private readonly mailService: MailService;

  @Process('sendForgotPasswordEmail')
  async sendForgotPasswordEmail(job: Job): Promise<number> {
    this.logger.debug('Start job: sendForgotPasswordEmail');
    const { email } = job.data;
    try {
      await this.mailService.sendForgotPasswordEmail(email);
    } catch (e) {
      this.logger.debug(e);
    }
    this.logger.debug('Done job: sendForgotPasswordEmail');
    return 1;
  }

  @Process('sendSignUpEmail')
  async sendSignUpEmail(job: Job): Promise<number> {
    this.logger.debug('Start job: sendSignUpEmail');

    try {
      await this.mailService.sendSignUpEmail(job.data);
    } catch (e) {
      this.logger.debug(e);
    }
    this.logger.debug('Done job: sendSignUpEmail');
    return 1;
  }
}
