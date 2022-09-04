import { LoggerService } from "@app/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { By, WebDriver, WebElement } from 'selenium-webdriver'
import { UsingJoinColumnOnlyOnOneSideAllowedError } from "typeorm";
import { ExtensionStatusData, SelenoidProviderInterface } from "../types/interfaces";
import { ExtensionForwardRuleType, ForwardingType, PbxExtensionStatus } from "../types/types";
import { GetExtension } from "./getExtension";
import { Login } from "./login";
import { Logout } from "./logout";

@Injectable()
export class ExtensionForward implements SelenoidProviderInterface {
    private webDriver: WebDriver;
    private serviceContext: string;
    constructor(
        private readonly logger: LoggerService,
        private readonly login: Login,
        private readonly logout: Logout,
        private readonly getPbxExtension: GetExtension
    ) {
        this.serviceContext = ExtensionForward.name;
    }

    async selenoidChange(data: ExtensionStatusData): Promise<any> {
        try {
            return this.updateExtensionForward(data);
        }catch(e){
            throw e;
        }
    } 

    private async updateExtensionForward(data: ExtensionStatusData){
        try {
            this.webDriver = await this.login.loginOnPbx();
            await this.getPbxExtension.getExtension(this.webDriver, data.exten);
            if(data.status === 'true'){
                await this.webDriver.findElement(By.xpath(`//*[contains(text(), ' ${data.exten} ')]//parent::tr[@tabindex='0']`)).click();
                await this.webDriver.sleep(1000);
                await this.chooseForwardingStatus(PbxExtensionStatus.CustomTwo);
                await this[this.getExtensionForward(data.type)](data.number, ForwardingType.ExternalForwarding);
                await this[this.getExtensionForward(data.type)](data.number, ForwardingType.InternalForwarding);
                await this.submitSetForwarding();
                await this.getPbxExtension.getExtension(this.webDriver, data.exten);
                await this.setForwardStatus(PbxExtensionStatus.CustomTwo)
            } else{
                await this.setForwardStatus(PbxExtensionStatus.Available)
            }
            return await this.logout.logoutOnPbx(this.webDriver);
        }catch(e){
            (!!this.webDriver)? await this.webDriver.quit() : '';
            throw e; 
        }
    }

    private async chooseForwardingStatus(frowardStatus: PbxExtensionStatus){
        try {
            await this.webDriver.findElement(By.xpath("//a[@ui-sref='.forwarding_rules']")).click();
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.xpath("//select[@name='status']")).click();
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.css(`option[value='${frowardStatus}']`)).click();
            await this.webDriver.sleep(2000);
        }catch(e){
            this.logger.error(e, this.serviceContext)
            throw 'Проблемы перехода в раздел переадресации';
        }
    }

    private async extension(number: string, forwardingType: ForwardingType){
        try{
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/select-enum-control[@prop='fwd.ForwardType']/div[@ng-hide='prop.hide']/select[@ng-model='prop.value']/option[@label='Forward to Extension']`)).click();
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']`)).click();
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']/div[@ng-hide="prop.hide"]/div[@ng-if="prop.lazy"]/div[@ng-model="prop.value"]/input[@type="search"]`)).click();
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']/div[@ng-hide="prop.hide"]/div[@ng-if="prop.lazy"]/div[@ng-model="prop.value"]/input[@type="search"]`)).clear();
            const elem = await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.DN'"]/select-control[@prop='fwd.ForwardDN']/div[@ng-hide="prop.hide"]/div[@ng-if="prop.lazy"]/div[@ng-model="prop.value"]/input[@type="search"]`)).sendKeys(number);
            await this.webDriver.sleep(5000);
            return await this.webDriver.findElement(By.xpath("//span[@ng-bind='label(item)']")).then((elem: WebElement) => { elem.click(); return true }, (err: any) => false );
        }catch(e){
            this.logger.error(e, this.serviceContext)
            throw 'Проблемы переадресации на внутренний номер';
        }
    }

    private async external(number: string, forwardingType: ForwardingType){
        try{
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/select-enum-control[@prop='fwd.ForwardType']/div[@ng-hide='prop.hide']/select[@ng-model='prop.value']/option[@label='Forward to number']`)).click();
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.ExternalNumber'"]/div/text-control/div[@ng-hide="prop.hide"]/input`)).clear();
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/div[@ng-if="fwd.ForwardType.selected=='TypeOfExtensionForward.ExternalNumber'"]/div/text-control/div[@ng-hide="prop.hide"]/input`)).sendKeys(number);
        }catch(e){
            this.logger.error(e, this.serviceContext)
            throw 'Проблемы внешней переадресации';
        }
    }

    private async mobile(number: string, forwardingType: ForwardingType){
        try{
            await this.webDriver.findElement(By.xpath(`//fwd-type-control[@fwd='profile.${forwardingType}._value']/select-enum-control[@prop='fwd.ForwardType']/div[@ng-hide='prop.hide']/select[@ng-model='prop.value']/option[@label='Forward to Mobile']`)).click();
            await this.webDriver.sleep(1000);
        }catch(e){
            this.logger.error(e, this.serviceContext)
            throw 'Проблемы мобильной переадресации';
        }
    }

    private async submitSetForwarding(){
        try{
            await this.webDriver.sleep(5000);
            await this.webDriver.findElement(By.id('btnSave')).click();
            await this.webDriver.sleep(5000);
        }catch(e){
            this.logger.error(e, this.serviceContext)
            throw 'Проблемы сохранения переадресации';
        }
    }

    private getExtensionForward(type: ExtensionForwardRuleType){
        switch (type) {
            case ExtensionForwardRuleType.extension:
                return 'extension'
            case ExtensionForwardRuleType.external:
                return 'external'
            case ExtensionForwardRuleType.mobile:
                return 'mobile'
        }
    }

    private async setForwardStatus( extensionStatus: PbxExtensionStatus){
        try {
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.id('btnStatus')).click();
            await this.webDriver.sleep(1000);
            await this.webDriver.findElement(By.xpath("//select[@ng-model='currentProfile']")).click();
            await this.webDriver.findElement(By.css(`option[value='${extensionStatus}']`)).click();
            await this.webDriver.findElement(By.className('close')).click();
            await this.webDriver.sleep(5000);
        }catch(e){
            this.logger.error(e, this.serviceContext)
            throw 'Проблемы установки статуса переадресации';
        }
    }
}