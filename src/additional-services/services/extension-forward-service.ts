import { Fwdprofile } from '@app/pbx3cx/entities';
import { Pbx3cxForwardStatusService } from '@app/pbx3cx/pbx3cx-forward-status.service';
import { Injectable } from '@nestjs/common';
import { FORWARD_TYPE_ERROR } from '../additional-services.constants';
import { ExtensionForwardType, ExtensionForwardRuleType } from '../interfaces/additional-services.enum';
import { ExtensionForwardStatus, GetExtensionForward } from '../interfaces/additional-services.interface';

@Injectable()
export class ExtensionForwardService {
  private serviceContext: string;
  constructor(private readonly pbxForward: Pbx3cxForwardStatusService) {
    this.serviceContext = ExtensionForwardService.name;
  }

  public async getLocalExtensionForward(
    currentForwardInfo: Fwdprofile,
    mobile: string,
  ): Promise<Omit<ExtensionForwardStatus, 'isForwardEnable'>> {
    return await this.getExtensionForward(this.getExtensionForwardStruct(ExtensionForwardType.external, currentForwardInfo, mobile));
  }

  private async getExtensionForward(data: GetExtensionForward): Promise<Omit<ExtensionForwardStatus, 'isForwardEnable'>> {
    if (this.isEndCall(data)) {
      return {
        forwardType: ExtensionForwardRuleType.endCall,
      };
    }

    if (this.checkIsVoiceMail(data)) {
      return {
        forwardType: ExtensionForwardRuleType.extensionVoiceMail,
      };
    }

    if (this.checkIsMobile(data)) {
      return {
        forwardType: ExtensionForwardRuleType.mobile,
        exten: data.mobile,
      };
    }

    if (this.checkIsExternalNumber(data)) {
      return {
        forwardType: ExtensionForwardRuleType.external,
        exten: data.outsideNumber,
      };
    }

    if (this.checkIsExtension(data)) {
      return {
        forwardType: ExtensionForwardRuleType.extension,
        exten: (await this.pbxForward.getExtenByIDDN(data.forwardToDn)).value,
      };
    }
  }

  private getExtensionForwardStruct(
    extensionForwardType: ExtensionForwardType,
    currentForwardInfo: Fwdprofile,
    mobile: string,
  ): GetExtensionForward {
    switch (extensionForwardType) {
      case ExtensionForwardType.internal:
        return {
          extension: currentForwardInfo.fkidextension,
          mobile,
          outsideNumber: currentForwardInfo.fwdtooutsidenumberMatch1,
          forwardToDn: currentForwardInfo.fkforwardtodnMatch1,
        };
      case ExtensionForwardType.external:
        return {
          extension: currentForwardInfo.fkidextension,
          mobile,
          outsideNumber: currentForwardInfo.fwdtooutsidenumberMatch2,
          forwardToDn: currentForwardInfo.fkforwardtodnMatch2,
        };
      default:
        throw FORWARD_TYPE_ERROR;
    }
  }

  private checkIsExternalNumber(data: GetExtensionForward): boolean {
    return data.forwardToDn == null && data.outsideNumber != data.mobile;
  }

  private checkIsMobile(data: GetExtensionForward): boolean {
    return data.forwardToDn == null && data.outsideNumber == data.mobile;
  }

  private checkIsExtension(data: GetExtensionForward): boolean {
    return data.outsideNumber == '' && data.forwardToDn != data.extension;
  }

  private checkIsVoiceMail(data: GetExtensionForward): boolean {
    return data.outsideNumber == '' && data.forwardToDn == data.extension;
  }

  private isEndCall(data: GetExtensionForward): boolean {
    return data.outsideNumber == '' && data.forwardToDn == null;
  }
}
