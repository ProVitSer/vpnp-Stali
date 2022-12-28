import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, until, WebDriver } from 'selenium-webdriver';
import { SelenoidWebdriver } from '../selenoid.webdriver';

@Injectable()
export class Login {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(
    private readonly selenoidWebDriver: SelenoidWebdriver,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = Login.name;
  }

  public async loginOnPbx(): Promise<WebDriver> {
    try {
      return await this._login();
    } catch (e) {
      throw e;
    }
  }

  private async _login(): Promise<WebDriver> {
    try {
      this.webDriver = await this.selenoidWebDriver.getWebDriver();
      return await this.authorization();
    } catch (e) {
      throw e;
    }
  }

  private async authorization(): Promise<WebDriver> {
    try {
      await this.webDriver.get(`https://${this.configService.get('pbx3cx.url')}/#/login`);
      await this.webDriver.manage().window().maximize();
      await this.webDriver.sleep(10000);
      await this.checkPrivacy();
      await this.webDriver.wait(until.elementLocated(By.className('btn btn-lg btn-primary btn-block ng-scope')), 10 * 10000);
      await this.webDriver
        .findElement(By.xpath("//input[@placeholder='User name or extension number']"))
        .sendKeys(this.configService.get('pbx3cx.username'));
      await this.webDriver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(this.configService.get('pbx3cx.password'));
      await this.webDriver.findElement(By.xpath('//*[@ng-dblclick="$ctrl.emptyAction()"]')).click();
      await this.webDriver.sleep(5000);
      return this.webDriver;
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      this.logger.error(e, this.serviceContext);
      throw 'Проблемы с авторизацией на веб интерфейсе АТС';
    }
  }

  private async checkPrivacy(): Promise<void> {
    try {
      await this.webDriver.findElement(By.xpath("//h1[contains(text(), 'Your connection is not private')]"));
      await this.webDriver.findElement(By.xpath("//button[@id='details-button']")).click();
      return await this.webDriver.findElement(By.xpath("//a[@id='proceed-link']")).click();
    } catch (e) {
      return;
    }
  }
}
