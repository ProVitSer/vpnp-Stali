import { LoggerService } from '@app/logger/logger.service';
import { EsetPath } from '@app/selenoid/interfaces/selenoid.enum';
import { SelenoidUtils } from '@app/selenoid/selenoid.utils';
import { SelenoidWebdriver } from '@app/selenoid/selenoid.webdriver';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, WebDriver } from 'selenium-webdriver';
import { AUTH_ESET_ERROR } from './constants';

@Injectable()
export class EsetLogin {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(
    private readonly selenoidWebDriver: SelenoidWebdriver,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = EsetLogin.name;
  }
  public async loginOnEset(): Promise<WebDriver> {
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
      await this.webDriver.get(`${this.configService.get('eset.url')}${EsetPath.startPage}`);
      await this.webDriver.manage().window().maximize();
      await this.webDriver.sleep(10000);
      await SelenoidUtils.checkPrivacy(this.webDriver);
      await this.webDriver.sleep(10000);
      await this.webDriver.findElement(By.id('loginInputUsername')).sendKeys(this.configService.get('eset.username'));
      await this.webDriver.findElement(By.id('loginInputPassword')).sendKeys(this.configService.get('eset.password'));
      await this.webDriver.findElement(By.xpath("//button[contains(text(), 'Submit')]")).click();
      await this.webDriver.sleep(5000);
      return this.webDriver;
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      this.logger.error(e, this.serviceContext);
      throw AUTH_ESET_ERROR;
    }
  }
}
