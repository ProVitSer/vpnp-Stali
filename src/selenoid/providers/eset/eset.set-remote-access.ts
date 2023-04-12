import { LoggerService } from '@app/logger/logger.service';
import { SelenoidProviderInterface } from '@app/selenoid/interfaces/selenoid.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, WebDriver } from 'selenium-webdriver';
import { ERROR_SET_PHONE_NUMBER, ERROR_SWITCH, SAVE_BUTTON_NOT_FOUND } from './eset.constants';
import { EsetLogin } from './eset.login';
import { EsetLogout } from './eset.logout';
import { EsetSearchUser } from './eset.search-user';
import { EsetPath, EsetStatus } from './eset.enum';
import { EsetSetRemoteAccessData } from './eset.interfaces';

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

  async selenoidAction(data: EsetSetRemoteAccessData): Promise<void> {
    try {
      return await this.change(data);
    } catch (e) {
      throw e;
    }
  }

  private async change(data: EsetSetRemoteAccessData): Promise<void> {
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

  private async saveChange(): Promise<void> {
    try {
      await this.webDriver.findElement(By.xpath("//button[contains(text(), 'Save')]")).click();
    } catch (e) {
      this.logger.info(SAVE_BUTTON_NOT_FOUND, this.serviceContext);
      return;
    }
  }

  private async setPhoneNumber(phoneNumber: string): Promise<void> {
    try {
      await this.webDriver.findElement(By.id('phoneNumber')).clear();
      await this.webDriver.findElement(By.id('phoneNumber')).sendKeys(phoneNumber);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_SET_PHONE_NUMBER;
    }
  }

  private async changeRemoteAccess(data: EsetSetRemoteAccessData): Promise<void> {
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

  private async changeOtp(): Promise<void> {
    await this.webDriver.findElement(By.xpath("(//td[contains(text(), 'Mobile Application OTP')]//parent::tr//td)[2]//div//div")).click();
    await this.webDriver.sleep(1000);
  }

  private async changePush(): Promise<void> {
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
