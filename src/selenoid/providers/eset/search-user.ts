import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { By, Key, WebDriver } from 'selenium-webdriver';
import { ERROR_SEARCH_USER } from './constants';

@Injectable()
export class EsetSearchUser {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(private readonly logger: LoggerService) {
    this.serviceContext = EsetSearchUser.name;
  }

  public async search(webDriver: WebDriver, userName: string): Promise<void> {
    try {
      this.webDriver = webDriver;
      return await this._search(userName);
    } catch (e) {
      throw e;
    }
  }

  private async _search(userName: string) {
    try {
      await this.webDriver.findElement(By.xpath("//div[contains(text(), 'Filter...')]")).click();
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.className('select__menu'));
      await this.webDriver.findElement(By.xpath("//div[contains(text(), 'User Name')]")).click();
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.xpath("//input[@placeholder='User Name']")).sendKeys(userName);
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.xpath("//input[@placeholder='User Name']")).sendKeys(Key.ENTER);
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.xpath(`(//div[contains(text(), '${userName}')])[1]`)).click();
      return await this.webDriver.sleep(5000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_SEARCH_USER;
    }
  }
}
