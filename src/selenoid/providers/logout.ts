import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { By, WebDriver } from 'selenium-webdriver';

@Injectable()
export class Logout {
  private webDriver: WebDriver;
  constructor(private readonly logger: LoggerService) {}

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
      this.logger.error(e);
      await this.webDriver.quit();
      throw 'Проблемы заверщение сеанса на веб интерфейсе АТС';
    }
  }
}
