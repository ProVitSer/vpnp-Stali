import { Injectable } from '@nestjs/common';
import { WebDriver, By } from 'selenium-webdriver';
import { AUTH_MAIL_ERROR } from './mail.constants';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class MailAuthorization {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(private readonly configService: ConfigService, private readonly logger: LoggerService) {
    this.serviceContext = MailAuthorization.name;
  }

  public async authorization(webDriver: WebDriver): Promise<void> {
    try {
      this.webDriver = webDriver;
      return await this._authorization();
    } catch (e) {
      throw e;
    }
  }

  private async _authorization(): Promise<void> {
    try {
      await this.webDriver.findElement(By.id('username')).sendKeys(this.configService.get('mailServer.username'));
      await this.webDriver.findElement(By.id('password')).sendKeys(this.configService.get('mailServer.password'));
      await this.webDriver.findElement(By.id('Logon')).click();
      await this.webDriver.sleep(1000);
      try {
        await this.webDriver.findElement(By.xpath(`//div[@data-page="V_USERLIST"]`));
      } catch (e) {
        throw e;
      }
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw AUTH_MAIL_ERROR;
    }
  }
}
