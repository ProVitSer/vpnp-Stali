import { LoggerService } from '@app/logger/logger.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMail } from './types/interfaces';


@Injectable()
export class MailService {
  private serviceContext: string;
  constructor(
      private mailerService: MailerService,
      private readonly configService: ConfigService,
      private readonly logger: LoggerService 
    ) {
      this.serviceContext = MailService.name;
    }

  public async sendMail({ to, from, subject, context, template }: SendMail): Promise<any> {
      try{
          console.log(to, from, subject, context, template )
        const result = await this.mailerService.sendMail({
          from: from || this.configService.get('mail.from'),
          to,
          subject: subject || "Информационное письмо",
          context,
          template
          });
        this.logger.info(result, this.serviceContext);
      }catch(e){
        this.logger.error(e, this.serviceContext);
        throw e;
      }
  }
}
