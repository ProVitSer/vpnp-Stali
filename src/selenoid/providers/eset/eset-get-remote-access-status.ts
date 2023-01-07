import { LoggerService } from '@app/logger/logger.service';
import { EsetGetRemoteAccessStatusData, SelenoidProviderInterface } from '@app/selenoid/interfaces/selenoid-interface';
import { EsetPath } from '@app/selenoid/interfaces/selenoid-types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, WebDriver } from 'selenium-webdriver';
import { ERROR_SWITCH } from './constants';
import { EsetLogin } from './login';
import { EsetLogout } from './logout';
import { EsetSearchUser } from './search-user';

@Injectable()
export class EsetGetRemoteAccessStatus implements SelenoidProviderInterface {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly login: EsetLogin,
    private readonly logout: EsetLogout,
    private readonly esetSearchUser: EsetSearchUser,
  ) {
    this.serviceContext = EsetGetRemoteAccessStatus.name;
  }

  async selenoidChange(data: EsetGetRemoteAccessStatusData): Promise<boolean> {
    try {
      return await this.change(data);
    } catch (e) {
      throw e;
    }
  }

  private async change(data: EsetGetRemoteAccessStatusData) {
    try {
      this.webDriver = await this.login.loginOnEset();
      await this.webDriver.get(`${this.configService.get('eset.url')}${EsetPath.userPager}`);
      await this.webDriver.sleep(5000);
      await this.esetSearchUser.search(this.webDriver, data.userName);
      const currentStatus = await this.checkRemoteAccess();
      await this.logout.logoutOnEset(this.webDriver);
      return currentStatus;
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      throw e;
    }
  }

  private async checkRemoteAccess() {
    try {
      const otpStatus = await this.getOtpStatus();
      const pushStatus = await this.getPushStatus();
      return pushStatus || otpStatus;
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_SWITCH;
    }
  }

  private async getOtpStatus(): Promise<boolean> {
    const status = await this.webDriver
      .findElement(By.xpath("(//td[contains(text(), 'Mobile Application OTP')]//parent::tr//td)[2]//div//input"))
      .getAttribute('value');
    return status === 'true' ? true : false;
  }

  private async getPushStatus(): Promise<boolean> {
    const status = await this.webDriver
      .findElement(By.xpath("(//td[contains(text(), 'Mobile Application Push')]//parent::tr//td)[2]//div//input"))
      .getAttribute('value');
    return status === 'true' ? true : false;
  }
}
