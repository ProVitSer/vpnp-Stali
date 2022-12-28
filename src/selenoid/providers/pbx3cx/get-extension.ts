import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { By, until, WebDriver } from 'selenium-webdriver';
import { ERROR_EXTENSION_NOT_FOUND } from './constants';

@Injectable()
export class GetExtension {
  private webDriver: WebDriver;
  constructor(private readonly configService: ConfigService) {}

  public async getExtension(webDriver: WebDriver, extension: string) {
    try {
      this.webDriver = webDriver;
      await this.webDriver.get(`https://${this.configService.get('pbx3cx.url')}/#/app/extensions`);
      await this.webDriver.wait(until.elementLocated(By.className('btn btn-sm btn-success btn-responsive ng-scope')), 10 * 10000);
      await this.webDriver.findElement(By.xpath("//input[@id='inputSearch']")).sendKeys(extension);
      await this.webDriver.sleep(5000);
      return await this.chechSearchExtension(extension);
    } catch (e) {
      throw e;
    }
  }

  private async chechSearchExtension(exten: string) {
    try {
      await this.webDriver
        .findElement(By.xpath(`//*[contains(text(), ' ${exten} ')]//parent::tr[@tabindex='0']/td[@mc-select-row="item"]`))
        .click();
      await this.webDriver.sleep(1000);
      await this.webDriver.wait(until.elementLocated(By.xpath("//label[@tabindex='0']")), 10 * 10000);
      await this.webDriver.findElement(By.xpath(`//*[contains(text(), ' ${exten} ')]`));
      return await this.webDriver.sleep(5000);
    } catch (e) {
      throw ERROR_EXTENSION_NOT_FOUND;
    }
  }
}
