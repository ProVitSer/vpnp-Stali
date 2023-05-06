import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, WebDriver } from 'selenium-webdriver';
import { SelenoidWebdriver } from '../../selenoid.webdriver';
import { SelenoidProviderInterface } from '../../interfaces/selenoid.interface';
import { ERROR_WEB_DRIVER } from '@app/selenoid/selenoid.constants';
import { MailCheckForwardData, MailCheckForwardResult } from './mail.interfaces';
import { MailAuthorization } from './mail.authorization';
import { MailSearchNeedUser } from './mail.search-need-user';
import { MailUserForward } from './mail.user-forward';

@Injectable()
export class MailCheckForward implements SelenoidProviderInterface {
  private webDriver: WebDriver;
  private serviceContext: string;
  private userName: string;
  private email: string;
  constructor(
    private readonly selenoidWebDriver: SelenoidWebdriver,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly mailAuthorization: MailAuthorization,
    private readonly mailSearchNeedUser: MailSearchNeedUser,
    private readonly mailUserForward: MailUserForward,
  ) {
    this.serviceContext = MailCheckForward.name;
  }

  async selenoidAction(data: MailCheckForwardData): Promise<MailCheckForwardResult> {
    try {
      return await this.checkMailForward(data);
    } catch (e) {
      throw e;
    }
  }

  private async checkMailForward(data: MailCheckForwardData): Promise<MailCheckForwardResult> {
    this.userName = data.email.match(/(.+)@(.+)/)[1];
    this.email = data.email.match(/(.+)@(.+)/)[0];
    const forwardData = { userName: this.userName, email: this.email };
    try {
      await this.getWebDriver();
      await this.webDriver.get(this.configService.get('mailServer.url'));
      await this.webDriver.manage().window().maximize();
      await this.webDriver.sleep(10000);

      await this.mailAuthorization.authorization(this.webDriver);
      await this.mailSearchNeedUser.searchNeedUser(this.webDriver, forwardData);
      await this.mailUserForward.goToUserForward(this.webDriver, forwardData);

      const result = await this.getForwardData();
      await this.webDriver.quit();
      return result;
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      throw e;
    }
  }

  private async getForwardData(): Promise<MailCheckForwardResult> {
    try {
      await this.webDriver.findElement(By.xpath("//label[@for='EnableForwarding']/input[@checked='true']"));
      const email = await this.webDriver.findElement(By.xpath("//input[@name='Address']"));
      const val = await email.getAttribute('value');
      return {
        isForwardEnable: true,
        email: val,
      };
    } catch (e) {
      return {
        isForwardEnable: false,
      };
    }
  }

  private async getWebDriver(): Promise<void> {
    try {
      this.webDriver = await this.selenoidWebDriver.getWebDriver();
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      this.logger.error(e, this.serviceContext);
      throw ERROR_WEB_DRIVER;
    }
  }
}
