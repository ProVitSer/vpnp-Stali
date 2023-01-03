// import { MailService } from '@app/database/mongo/services/mail.service';
import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, WebDriver } from 'selenium-webdriver';
import { SelenoidWebdriver } from '../../selenoid.webdriver';
import { MailForwardData, SelenoidProviderInterface } from '../../interfaces/interface';
import * as moment from 'moment';
import { AUTH_MAIL_ERROR, ERROR_LOGOUT, ERROR_USER_FORWARD, ERROR_USER_NOT_FOUND } from './constants';
import { ERROR_WEB_DRIVER } from '@app/selenoid/selenoid.constants';

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
    private readonly logger: LoggerService, // private readonly mail: MailService,
  ) {
    this.serviceContext = MailForward.name;
  }

  async selenoidChange(data: MailForwardData): Promise<any> {
    try {
      this.enableForward = data.status;
      if (this.chechUpdateNow(data.dateFrom)) {
        await this.setEmailForward(data);
      }
      return await this.setInfo(data);
    } catch (e) {
      throw e;
    }
  }

  private async setInfo(data: MailForwardData) {
    try {
      if (this.enableForward && data?.change == undefined) {
        //return await this.mail.setMailForward(data);
      }
    } catch (e) {
      throw e;
    }
  }

  private chechUpdateNow(dateFrom: string) {
    return dateFrom == moment().format('DD.MM.YYYY').toString();
  }

  private async setEmailForward(data: MailForwardData) {
    this.userName = data.from.match(/(.+)@(.+)/)[1];
    this.email = data.from.match(/(.+)@(.+)/)[0];
    try {
      await this.getWebDriver();
      await this.webDriver.get(this.configService.get('mailServer.url'));
      await this.webDriver.manage().window().maximize();
      await this.webDriver.sleep(10000);
      await this.authorization();
      await this.searchNeedUser(this.userName);
      await this.goToUserForward();
      await this.setForward(data);
      return await this.webDriver.quit();
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      throw e;
    }
  }

  private async setForward(data: MailForwardData) {
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

  private async exit() {
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

  private async goToUserForward() {
    try {
      // Проваливаемся в открывшееся диалоговое окно,переход в раздел переадресации
      await this.webDriver.switchTo().frame(this.webDriver.findElement(By.id('dialog:useredit_account.wdm')));
      await this.webDriver.findElement(By.id('MAForwarding')).click();
      await this.webDriver.sleep(1000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw `${ERROR_USER_FORWARD} ${this.email}`;
    }
  }

  private async searchNeedUser(userName: string) {
    try {
      // Переходво во вкладку Администрирования почты
      await this.webDriver.findElement(By.xpath(`//div[@onclick="RA.views.load('V_USERLIST', 'MainWindow=1');"]`)).click();
      await this.webDriver.sleep(1000);

      // Нажатие кнопки фильтрации для поиска
      await this.webDriver.findElement(By.id('filter_button')).click();
      await this.webDriver.sleep(5000);

      // Проваливаемся в открывшееся диалоговое окно. Очищаем бокс поиска и заполянем именем пользователя, который которго требуется найти
      await this.webDriver.switchTo().frame(this.webDriver.findElement(By.id('dialog:userlist_filter.wdm')));
      await this.webDriver.findElement(By.id('filterPattern')).clear();
      await this.webDriver.findElement(By.id('filterPattern')).sendKeys(userName);
      await this.webDriver.findElement(By.id('ApplyButton')).click();
      await this.webDriver.sleep(1000);

      // Возвращаемся в основное окно
      await this.webDriver.switchTo().defaultContent();

      // Поиск пользователя по полному совпадению пользователь@домен, двойное нажатие
      const item = await this.webDriver.findElement(By.xpath(`//tr[@glc_form_waform_selectid='${this.email}']`));
      await this.webDriver.actions().doubleClick(item).perform();
      return await this.webDriver.sleep(1000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw `${ERROR_USER_NOT_FOUND} ${this.email}`;
    }
  }

  private async authorization() {
    try {
      await this.webDriver.findElement(By.id('username')).sendKeys(this.configService.get('mailServer.username'));
      await this.webDriver.findElement(By.id('password')).sendKeys(this.configService.get('mailServer.password'));
      await this.webDriver.findElement(By.id('Logon')).click();
      return await this.webDriver.sleep(1000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw AUTH_MAIL_ERROR;
    }
  }

  private async getWebDriver() {
    try {
      this.webDriver = await this.selenoidWebDriver.getWebDriver();
      return;
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      this.logger.error(e, this.serviceContext);
      throw ERROR_WEB_DRIVER;
    }
  }
}
