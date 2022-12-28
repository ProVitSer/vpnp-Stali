import { LoggerService } from '@app/logger/logger.service';
import { EsetData, SelenoidProviderInterface } from '@app/selenoid/interfaces/interface';
import { EsetPath, EsetStatus } from '@app/selenoid/interfaces/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, Key, WebDriver } from 'selenium-webdriver';
import { ERROR_SEARCH_USER, ERROR_SET_PHONE_NUMBER, ERROR_SWITCH, SAVE_BUTTON_NOT_FOUND } from './constants';
import { EsetLogin } from './login';
import { EsetLogout } from './logout';

@Injectable()
export class Eset implements SelenoidProviderInterface {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly login: EsetLogin,
    private readonly logout: EsetLogout,
  ) {
    this.serviceContext = Eset.name;
  }

  async selenoidChange(data: EsetData): Promise<any> {
    try {
      return await this.change(data);
    } catch (e) {
      throw e;
    }
  }

  private async change(data: EsetData) {
    try {
      this.webDriver = await this.login.loginOnEset();
      await this.webDriver.get(`${this.configService.get('eset.url')}${EsetPath.userPager}`);
      await this.webDriver.sleep(5000);
      await this.searchUser(data.userName);
      await this.changeSwitches(data.status);
      await this.setPhoneNumber(data.phoneNumber);
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

  private async searchUser(userName: string) {
    try {
      await this.webDriver.findElement(By.xpath("//div[contains(text(), 'Filter...')]")).click();
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.className('select__menu'));
      await this.webDriver.findElement(By.xpath("//div[contains(text(), 'User Name')]")).click();
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.xpath("//input[@placeholder='User Name']")).sendKeys(userName);
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.xpath("//input[@placeholder='User Name']")).sendKeys(Key.ENTER);
      await this.webDriver.findElement(By.xpath(`(//div[contains(text(), '${userName}')])[1]`)).click();
      return await this.webDriver.sleep(5000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_SEARCH_USER;
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

  private async changeSwitches(status: EsetStatus) {
    try {
      const otpStatus = await this.getOtpStatus();
      const pushStatus = await this.getPushStatus();

      switch (status) {
        case EsetStatus.on:
          if (!otpStatus) await this.changeOtp();
          if (!pushStatus) await this.changePush();
          break;
        case EsetStatus.off:
          if (otpStatus) await this.changeOtp();
          if (pushStatus) await this.changePush();
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
