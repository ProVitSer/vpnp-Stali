import { HealthService } from '@app/health/health.service';
import { HealthCheckMailFormat } from '@app/health/types/interfaces';
import { HealthCheckStatusType, ReturnHealthFormatType } from '@app/health/types/type';
import { LoggerService } from '@app/logger/logger.service';
import { MailService } from '@app/mail/mail.service';
import { MailSubjectTypeMap } from '@app/mail/types/interfaces';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

interface MailSendInfo {
  isScheduledSend: boolean;
  lastCheckStatus: HealthCheckStatusType;
}

@Injectable()
export class HealthScheduledService implements OnApplicationBootstrap {
  private mailSendInfo: MailSendInfo;
  private serviceContext: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly health: HealthService,
    private readonly mail: MailService,
  ) {
    this.serviceContext = HealthScheduledService.name;
    this.mailSendInfo = {
      isScheduledSend: false,
      lastCheckStatus: HealthCheckStatusType.ok,
    };
  }

  async onApplicationBootstrap() {
    if (!process.env.NODE_APP_INSTANCE || Number(process.env.NODE_APP_INSTANCE) === 0) {
      try {
        const result = await this.health.check<HealthCheckMailFormat>(ReturnHealthFormatType.mail);
        this.mailSendInfo.lastCheckStatus = result.status;
        return await this.sendMailInfo(result);
      } catch (e) {
        this.logger.error(`Error HealthServiceScheduledService on application start  ${e}`, this.serviceContext);
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendScheduled() {
    if (!process.env.NODE_APP_INSTANCE || Number(process.env.NODE_APP_INSTANCE) === 0) {
      try {
        const result = await this.health.check<HealthCheckMailFormat>(ReturnHealthFormatType.mail);
        this.logger.info(result, this.serviceContext);
        if (this.checkSendMail(result.status)) {
          this.mailSendInfo.isScheduledSend = true;
          this.mailSendInfo.lastCheckStatus = result.status;
          return await this.sendMailInfo(result);
        }
      } catch (e) {
        this.logger.error(`Error HealthServiceScheduledService ${e}`, this.serviceContext);
      }
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  enableMailSend() {
    if (!process.env.NODE_APP_INSTANCE || Number(process.env.NODE_APP_INSTANCE) === 0) {
      return (this.mailSendInfo.isScheduledSend = false);
    }
  }

  private async sendMailInfo(healthResult: HealthCheckMailFormat) {
    try {
      const sendMailInfo = this.getSendMailInfoData(healthResult);
      return await this.mail.sendMail(sendMailInfo);
    } catch (e) {
      this.logger.error(`Error send mail from HealthServiceScheduledService ${e}`, this.serviceContext);
    }
  }

  private checkSendMail(healthStatus: HealthCheckStatusType): boolean {
    if (this.mailSendInfo.isScheduledSend && this.mailSendInfo.lastCheckStatus !== healthStatus) {
      return true;
    } else if (!this.mailSendInfo.isScheduledSend && this.mailSendInfo.lastCheckStatus !== healthStatus) {
      return true;
    }
    return false;
  }

  private getSendMailInfoData(healthResult: HealthCheckMailFormat) {
    return {
      to: this.configService.get('mail.mailListNotifyer'),
      from: this.configService.get('mail.mailFrom'),
      subject: MailSubjectTypeMap[healthResult.status],
      context: { service: healthResult.service },
      template: 'service-status.hbs',
    };
  }
}
