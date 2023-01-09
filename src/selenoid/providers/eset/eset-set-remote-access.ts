import { LoggerService } from '@app/logger/logger.service';
import { EsetSetRemoteAccessData, SelenoidProviderInterface } from '@app/selenoid/interfaces/selenoid.interface';
import { EsetPath, EsetStatus } from '@app/selenoid/interfaces/selenoid.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, WebDriver } from 'selenium-webdriver';
import { ERROR_SET_PHONE_NUMBER, ERROR_SWITCH, SAVE_BUTTON_NOT_FOUND } from './constants';
import { EsetLogin } from './login';
import { EsetLogout } from './logout';
import { EsetSearchUser } from './search-user';

@Injectable()
export class EsetSetRemoteAccess implements SelenoidProviderInterface {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly login: EsetLogin,
    private readonly logout: EsetLogout,
    private readonly esetSearchUser: EsetSearchUser,
  ) {
    this.serviceContext = EsetSetRemoteAccess.name;
  }

  async selenoidChange(data: EsetSetRemoteAccessData): Promise<any> {
    try {
      return await this.change(data);
    } catch (e) {
      throw e;
    }
  }

  private async change(data: EsetSetRemoteAccessData) {
    try {
      this.webDriver = await this.login.loginOnEset();
      await this.webDriver.get(`${this.configService.get('eset.url')}${EsetPath.userPager}`);
      await this.webDriver.sleep(5000);
      await this.esetSearchUser.search(this.webDriver, data.userName);
      await this.changeRemoteAccess(data);
      await this.saveChange();
      return await this.logout.logoutOnEset(this.webDriver);
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      throw e;
    }
  }

  private async saveChange() {
    try {
      await this.webDriver.findElement(By.xpath("//button[contains(text(), 'Save')]")).click();
    } catch (e) {
      this.logger.info(SAVE_BUTTON_NOT_FOUND, this.serviceContext);
      return;
    }
  }

  private async setPhoneNumber(phoneNumber: string) {
    try {
      await this.webDriver.findElement(By.id('phoneNumber')).clear();
      await this.webDriver.findElement(By.id('phoneNumber')).sendKeys(phoneNumber);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_SET_PHONE_NUMBER;
    }
  }

  private async changeRemoteAccess(data: EsetSetRemoteAccessData) {
    try {
      const otpStatus = await this.getOtpStatus();
      const pushStatus = await this.getPushStatus();

      switch (data.status) {
        case EsetStatus.on:
          if (!otpStatus) await this.changeOtp();
          if (!pushStatus) await this.changePush();
          await this.setPhoneNumber(data.phoneNumber);
          break;
        case EsetStatus.off:
          if (otpStatus) await this.changeOtp();
          if (pushStatus) await this.changePush();
          await this.webDriver.findElement(By.id('phoneNumber')).clear();
          break;
        default:
          break;
      }
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_SWITCH;
    }
  }

  private async changeOtp() {
    await this.webDriver.findElement(By.xpath("(//td[contains(text(), 'Mobile Application OTP')]//parent::tr//td)[2]//div//div")).click();
    await this.webDriver.sleep(1000);
  }

  private async changePush() {
    await this.webDriver.findElement(By.xpath("(//td[contains(text(), 'Mobile Application Push')]//parent::tr//td)[2]//div//div")).click();
    await this.webDriver.sleep(1000);
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
