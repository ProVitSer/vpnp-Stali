import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { By, WebDriver } from 'selenium-webdriver';
import { SelenoidProviderInterface } from '../../interfaces/selenoid.interface';
import { GetExtension } from './pbx3cx.get-extension';
import { Login } from './pbx3cx.login';
import { Logout } from './pbx3cx.logout';
import { ERROR_CHANGE_QUEUE_STATUS } from './pbx3cx.constants';
import { QueueStatusData } from './pbx3cx.interfaces';

@Injectable()
export class QueueStatus implements SelenoidProviderInterface {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly login: Login,
    private readonly logout: Logout,
    private readonly extension: GetExtension,
  ) {
    this.serviceContext = QueueStatus.name;
  }

  async selenoidAction(data: QueueStatusData): Promise<void> {
    try {
      return await this.change(data);
    } catch (e) {
      throw e;
    }
  }

  private async change(data: QueueStatusData): Promise<void> {
    try {
      this.webDriver = await this.login.loginOnPbx();
      await this.extension.getExtension(this.webDriver, data.exten);
      await this.changeQueueStatus(data.status);
      return await this.logout.logoutOnPbx(this.webDriver);
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      throw e;
    }
  }

  private async changeQueueStatus(status: boolean): Promise<void> {
    try {
      await this.webDriver.findElement(By.id('btnStatus')).click();
      await this.webDriver.sleep(1000);
      await this.webDriver.findElement(By.xpath("//select[@ng-model='queueStatus']")).click();
      const queueStatus = !!status ? 1 : 0;
      await this.webDriver.findElement(By.css(`option[value='${queueStatus}']`)).click();
      await this.webDriver.findElement(By.className('close')).click();
      await this.webDriver.sleep(5000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_CHANGE_QUEUE_STATUS;
    }
  }
}
