import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, WebDriver } from 'selenium-webdriver';
import { SelenoidWebdriver } from '../../selenoid.webdriver';
import { SelenoidProviderInterface } from '../../interfaces/selenoid.interface';
import { ERROR_LOGOUT } from './mail.constants';
import { ERROR_WEB_DRIVER } from '@app/selenoid/selenoid.constants';
import { UtilsService } from '@app/utils/utils.service';
import { MailForwardData } from './mail.interfaces';
import { MailAuthorization } from './mail.authorization';
import { MailSearchNeedUser } from './mail.search-need-user';
import { MailUserForward } from './mail.user-forward';

@Injectable()
export class MailForward implements SelenoidProviderInterface {
  private webDriver: WebDriver;
  private serviceContext: string;
  private userName: string;
  private email: string;
  private enableForward: boolean;
  constructor(
    private readonly selenoidWebDriver: SelenoidWebdriver,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly mailAuthorization: MailAuthorization,
    private readonly mailSearchNeedUser: MailSearchNeedUser,
    private readonly mailUserForward: MailUserForward,
  ) {
    this.serviceContext = MailForward.name;
  }

  async selenoidAction(data: MailForwardData): Promise<boolean> {
    try {
      this.enableForward = data.status;
      await this._selenoidAction(data);
      return true;
    } catch (e) {
      throw e;
    }
  }

  private async _selenoidAction(data: MailForwardData): Promise<void> {
    try {
      if (UtilsService.isDateNow(data.dateFrom)) {
        await this.setEmailForward(data);
        return;
      }

      if (UtilsService.isDateNow(data.dateTo)) {
        await this.setEmailForward(data);
        return;
      }
    } catch (e) {
      throw e;
    }
  }

  private async setEmailForward(data: MailForwardData): Promise<void> {
    this.userName = data.from.match(/(.+)@(.+)/)[1];
    this.email = data.from.match(/(.+)@(.+)/)[0];
    const forwardData = { userName: this.userName, email: this.email };
    try {
      await this.getWebDriver();
      await this.webDriver.get(this.configService.get('mailServer.url'));
      await this.webDriver.manage().window().maximize();
      await this.webDriver.sleep(10000);

      await this.mailAuthorization.authorization(this.webDriver);
      await this.mailSearchNeedUser.searchNeedUser(this.webDriver, forwardData);
      await this.mailUserForward.goToUserForward(this.webDriver, forwardData);
      await this.setForward(data);
      return await this.webDriver.quit();
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      throw e;
    }
  }

  private async setForward(data: MailForwardData): Promise<void> {
    try {
      // Проверка включена переадресация или нет
      // <input type="checkbox" name="EnableForwarding" id="EnableForwarding" onclick="Enable();RA.setIsDirty()" checked="true">
      await this.webDriver.findElement(By.xpath("//label[@for='EnableForwarding']/input[@checked='true']"));
      if (this.enableForward) {
        this.logger.info(`Переадресация уже включена для пользователя ${this.email}`, this.serviceContext);
        await this.webDriver.findElement(By.id('CancelButton')).click();
        await this.webDriver.sleep(5000);
        return await this.exit();
      } else {
        await this.webDriver.findElement(By.xpath("//input[@name='Address']")).clear();
        await this.webDriver.findElement(By.xpath("//label[@for='EnableForwarding']")).click();
        await this.webDriver.sleep(5000);
        await this.webDriver.findElement(By.id('SaveAndCloseButton')).click();
        return await this.exit();
      }
    } catch (e) {
      if (this.enableForward) {
        await this.webDriver.findElement(By.xpath("//label[@for='EnableForwarding']")).click();
        await this.webDriver.findElement(By.xpath("//input[@name='Address']")).clear();
        await this.webDriver.findElement(By.xpath("//input[@name='Address']")).sendKeys(`${data.to}`);
        await this.webDriver.sleep(5000);
        await this.webDriver.findElement(By.id('SaveAndCloseButton')).click();
        return await this.exit();
      } else {
        this.logger.info(`Переадресация уже включена для пользователя ${this.email}`, this.serviceContext);
        await this.webDriver.findElement(By.id('CancelButton')).click();
        await this.webDriver.sleep(5000);
        return await this.exit();
      }
    }
  }

  private async exit(): Promise<void> {
    try {
      await this.webDriver.sleep(5000);
      await this.webDriver.switchTo().defaultContent();
      await this.webDriver.findElement(By.id('SignOut')).click();
      await this.webDriver.sleep(5000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw `${ERROR_LOGOUT} ${this.email}`;
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
