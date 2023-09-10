import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { By, WebDriver } from 'selenium-webdriver';
import { ERROR_LOGOUT_PBX } from './pbx3cx.constants';

@Injectable()
export class Logout {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(private readonly logger: LoggerService) {
    this.serviceContext = Logout.name;
  }

  public async logoutOnPbx(webDriver: WebDriver): Promise<void> {
    try {
      this.webDriver = webDriver;
      return await this._logoutOnPbx();
    } catch (e) {
      throw e;
    }
  }

  private async _logoutOnPbx(): Promise<void> {
    try {
      await this.webDriver.findElement(By.xpath("//li[@is-open='user.isopen']")).click();
      await this.webDriver.findElement(By.xpath("//li[@ng-controller='LogoutCtrl']")).click();
      await this.webDriver.sleep(5000);
      return await this.webDriver.quit();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      await this.webDriver.quit();
      throw ERROR_LOGOUT_PBX;
    }
  }
}
