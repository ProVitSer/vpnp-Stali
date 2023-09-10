import { Injectable } from '@nestjs/common';
import { By, WebDriver } from 'selenium-webdriver';

@Injectable()
export class SelenoidUtils {
  static async checkPrivacy(webDriver: WebDriver): Promise<void> {
    try {
      await webDriver.sleep(1000);
      await webDriver.findElement(By.xpath("//h1[contains(text(), 'Your connection is not private')]"));
      await webDriver.findElement(By.xpath("//button[@id='details-button']")).click();
      await webDriver.sleep(500);
      await webDriver.findElement(By.xpath("//a[@id='proceed-link']")).click();
      await webDriver.sleep(500);
      return;
    } catch (e) {
      return;
    }
  }
}
