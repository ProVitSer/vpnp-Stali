import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { By, WebDriver } from 'selenium-webdriver';
import { ERROR_LOGOUT_ESET } from './eset.constants';

@Injectable()
export class EsetLogout {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(private readonly logger: LoggerService) {
    this.serviceContext = EsetLogout.name;
  }

  public async logoutOnEset(webDriver: WebDriver): Promise<void> {
    try {
      this.webDriver = webDriver;
      return await this._logoutOnEset();
    } catch (e) {
      throw e;
    }
  }

  private async _logoutOnEset(): Promise<void> {
    try {
      await this.webDriver.findElement(By.xpath("//div[contains(text(),'LOGOUT')]//parent::a")).click();
      await this.webDriver.sleep(5000);
      return await this.webDriver.quit();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      await this.webDriver.quit();
      throw ERROR_LOGOUT_ESET;
    }
  }
}
