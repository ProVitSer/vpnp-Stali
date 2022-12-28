import { Injectable } from '@nestjs/common';
import { By, WebDriver } from 'selenium-webdriver';

@Injectable()
export class SelenoidUtils {
  static async checkPrivacy(webDriver: WebDriver): Promise<void> {
    try {
      await webDriver.findElement(By.xpath("//h1[contains(text(), 'Your connection is not private')]"));
      await webDriver.findElement(By.xpath("//button[@id='details-button']")).click();
      return await webDriver.findElement(By.xpath("//a[@id='proceed-link']")).click();
    } catch (e) {
      return;
    }
  }
}
