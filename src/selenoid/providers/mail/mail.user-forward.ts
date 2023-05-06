import { Injectable } from '@nestjs/common';
import { WebDriver, By } from 'selenium-webdriver';
import { ERROR_USER_FORWARD } from './mail.constants';
import { SearchNeedUserData } from './mail.interfaces';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class MailUserForward {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(private readonly logger: LoggerService) {
    this.serviceContext = MailUserForward.name;
  }

  public async goToUserForward(webDriver: WebDriver, forwardData: SearchNeedUserData): Promise<void> {
    try {
      this.webDriver = webDriver;
      return await this._goToUserForward(forwardData);
    } catch (e) {
      throw e;
    }
  }

  private async _goToUserForward(forwardData: SearchNeedUserData): Promise<void> {
    try {
      // Проваливаемся в открывшееся диалоговое окно,переход в раздел переадресации
      await this.webDriver.switchTo().frame(this.webDriver.findElement(By.id('dialog:useredit_account.wdm')));
      await this.webDriver.findElement(By.id('MAForwarding')).click();
      await this.webDriver.sleep(1000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw `${ERROR_USER_FORWARD} ${forwardData.email}`;
    }
  }
}
