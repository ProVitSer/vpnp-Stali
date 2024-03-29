import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { By, WebDriver, WebElement } from 'selenium-webdriver';
import { SelenoidProviderInterface } from '../../interfaces/selenoid.interface';
import { GetExtension } from './pbx3cx.get-extension';
import { Login } from './pbx3cx.login';
import { Logout } from './pbx3cx.logout';
import {
  ERROR_FORWARD,
  ERROR_FORWARD_TO_EXTERNAL,
  ERROR_FORWARD_TO_LOCAL_EXTENSION,
  ERROR_FORWARD_TO_MOBILEL,
  ERROR_SET_FORWARD,
  SAVE_ERROR,
} from './pbx3cx.constants';
import { UtilsService } from '@app/utils/utils.service';
import { ExtensionStatusData } from './pbx3cx.interfaces';
import { ForwardRuleType, ForwardingType, PbxExtensionStatus } from './pbx3cx.enum';

@Injectable()
export class ExtensionForward implements SelenoidProviderInterface {
  private webDriver: WebDriver;
  private serviceContext: string;
  private enableForward: boolean;
  constructor(
    private readonly logger: LoggerService,
    private readonly login: Login,
    private readonly logout: Logout,
    private readonly getPbxExtension: GetExtension,
  ) {
    this.serviceContext = ExtensionForward.name;
  }

  async selenoidAction(data: ExtensionStatusData): Promise<void> {
    try {
      this.enableForward = data.status;
      return await this._selenoidAction(data);
    } catch (e) {
      throw e;
    }
  }

  private async _selenoidAction(data: ExtensionStatusData): Promise<void> {
    try {
      if (UtilsService.isDateNow(data.dateFrom)) {
        await this.updateExtensionForward(data);
        return;
      }

      if (UtilsService.isDateNow(data.dateTo)) {
        await this.updateExtensionForward(data);
        return;
      }
    } catch (e) {
      throw e;
    }
  }

  private async updateExtensionForward(data: ExtensionStatusData): Promise<void> {
    try {
      this.webDriver = await this.login.loginOnPbx();
      await this.getPbxExtension.getExtension(this.webDriver, data.exten);
      if (this.enableForward) {
        await this.webDriver.findElement(By.xpath(`//*[contains(text(), ' ${data.exten} ')]//parent::tr[@tabindex='0']`)).click();
        await this.webDriver.sleep(1000);
        await this.chooseForwardingStatus(PbxExtensionStatus.CustomTwo);
        await this[this.getExtensionForward(data.type)](data.number, ForwardingType.ExternalForwarding);
        await this[this.getExtensionForward(data.type)](data.number, ForwardingType.InternalForwarding);
        await this.submitSetForwarding();
        await this.getPbxExtension.getExtension(this.webDriver, data.exten);
        await this.setForwardStatus(PbxExtensionStatus.CustomTwo);
      } else {
        await this.setForwardStatus(PbxExtensionStatus.Available);
      }
      return await this.logout.logoutOnPbx(this.webDriver);
    } catch (e) {
      !!this.webDriver ? await this.webDriver.quit() : '';
      throw e;
    }
  }

  private async chooseForwardingStatus(frowardStatus: PbxExtensionStatus): Promise<void> {
    try {
      await this.webDriver.findElement(By.xpath("//a[@ui-sref='.forwarding_rules']")).click();
      await this.webDriver.sleep(1000);
      await this.webDriver.findElement(By.xpath("//select[@name='status']")).click();
      await this.webDriver.sleep(1000);
      await this.webDriver.findElement(By.css(`option[value='${frowardStatus}']`)).click();
      await this.webDriver.sleep(2000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_FORWARD;
    }
  }

  private async extension(number: string, forwardingType: ForwardingType): Promise<boolean> {
    try {
      await this.webDriver.sleep(1000);
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/select-enum-control[@prop='fwd.ForwardType']/div[@ng-hide='prop.hide']/select[@ng-model='prop.value']/option[@label='Forward to Extension']`,
          ),
        )
        .click();
      await this.webDriver.sleep(1000);
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']`,
          ),
        )
        .click();
      await this.webDriver.sleep(1000);
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']/div[@ng-hide="prop.hide"]/div[@ng-if="prop.lazy"]/div[@ng-model="prop.value"]/input[@type="search"]`,
          ),
        )
        .click();
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']/div[@ng-hide="prop.hide"]/div[@ng-if="prop.lazy"]/div[@ng-model="prop.value"]/input[@type="search"]`,
          ),
        )
        .clear();
      const elem = await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']/div[@ng-hide="prop.hide"]/div[@ng-if="prop.lazy"]/div[@ng-model="prop.value"]/input[@type="search"]`,
          ),
        )
        .sendKeys(number);
      await this.webDriver.sleep(5000);
      return await this.webDriver.findElement(By.xpath("//span[@ng-bind='label(item)']")).then(
        (elem: WebElement) => {
          elem.click();
          return true;
        },
        (err: any) => false,
      );
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_FORWARD_TO_LOCAL_EXTENSION;
    }
  }

  private async external(number: string, forwardingType: ForwardingType): Promise<void> {
    try {
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/select-enum-control[@prop='fwd.ForwardType']/div[@ng-hide='prop.hide']/select[@ng-model='prop.value']/option[@label='Forward to number']`,
          ),
        )
        .click();
      await this.webDriver.sleep(1000);
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.ExternalNumber'"]/div/text-control/div[@ng-hide="prop.hide"]/input`,
          ),
        )
        .clear();
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.ExternalNumber'"]/div/text-control/div[@ng-hide="prop.hide"]/input`,
          ),
        )
        .sendKeys(number);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_FORWARD_TO_EXTERNAL;
    }
  }

  private async mobile(number: string, forwardingType: ForwardingType): Promise<void> {
    try {
      await this.webDriver
        .findElement(
          By.xpath(
            `//fwd-type-control[@fwd='profile.${forwardingType}._value']/select-enum-control[@prop='fwd.ForwardType']/div[@ng-hide='prop.hide']/select[@ng-model='prop.value']/option[@label='Forward to Mobile']`,
          ),
        )
        .click();
      await this.webDriver.sleep(1000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_FORWARD_TO_MOBILEL;
    }
  }

  private async submitSetForwarding(): Promise<void> {
    try {
      await this.webDriver.sleep(5000);
      await this.webDriver.findElement(By.id('btnSave')).click();
      await this.webDriver.sleep(5000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw SAVE_ERROR;
    }
  }

  private getExtensionForward(type: ForwardRuleType): string {
    switch (type) {
      case ForwardRuleType.extension:
        return 'extension';
      case ForwardRuleType.external:
        return 'external';
      case ForwardRuleType.mobile:
        return 'mobile';
    }
  }

  private async setForwardStatus(extensionStatus: PbxExtensionStatus): Promise<void> {
    try {
      await this.webDriver.sleep(1000);
      await this.webDriver.findElement(By.id('btnStatus')).click();
      await this.webDriver.sleep(1000);
      await this.webDriver.findElement(By.xpath("//select[@ng-model='currentProfile']")).click();
      await this.webDriver.findElement(By.css(`option[value='${extensionStatus}']`)).click();
      await this.webDriver.findElement(By.className('close')).click();
      await this.webDriver.sleep(5000);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw ERROR_SET_FORWARD;
    }
  }
}
