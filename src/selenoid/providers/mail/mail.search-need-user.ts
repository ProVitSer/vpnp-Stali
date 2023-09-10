import { Injectable } from '@nestjs/common';
import { WebDriver, By } from 'selenium-webdriver';
import { ERROR_USER_NOT_FOUND } from './mail.constants';
import { SearchNeedUserData } from './mail.interfaces';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class MailSearchNeedUser {
  private webDriver: WebDriver;
  private serviceContext: string;
  constructor(private readonly logger: LoggerService) {
    this.serviceContext = MailSearchNeedUser.name;
  }

  public async searchNeedUser(webDriver: WebDriver, forwardData: SearchNeedUserData): Promise<void> {
    try {
      this.webDriver = webDriver;
      return await this._searchNeedUser(forwardData);
    } catch (e) {
      throw e;
    }
  }

  private async _searchNeedUser(forwardData: SearchNeedUserData): Promise<void> {
    try {
      // Переходво во вкладку Администрирования почты
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.xpath(`//div[@data-page="V_USERLIST"]`)).click();
      await this.webDriver.sleep(1000);

      // Нажатие кнопки фильтрации для поиска
      await this.webDriver.findElement(By.id('filter_button')).click();
      await this.webDriver.sleep(5000);

      // Проваливаемся в открывшееся диалоговое окно. Очищаем бокс поиска и заполянем именем пользователя, который которго требуется найти
      await this.webDriver.switchTo().frame(this.webDriver.findElement(By.id('dialog:userlist_filter.wdm')));
      await this.webDriver.findElement(By.id('filterPattern')).clear();
      await this.webDriver.findElement(By.id('filterPattern')).sendKeys(forwardData.userName);
      await this.webDriver.findElement(By.id('ApplyButton')).click();
      await this.webDriver.sleep(1000);

      // Возвращаемся в основное окно
      await this.webDriver.switchTo().defaultContent();

      // Поиск пользователя по полному совпадению пользователь@домен, двойное нажатие
      const item = await this.webDriver.findElement(By.xpath(`//tr[@glc_form_waform_selectid='${forwardData.email}']`));
      await this.webDriver.actions().doubleClick(item).perform();
      return await this.webDriver.sleep(1000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw `${ERROR_USER_NOT_FOUND} ${forwardData.email}`;
    }
  }
}
