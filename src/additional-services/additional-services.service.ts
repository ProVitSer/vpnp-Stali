import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { ExtensionForwardDto } from './dto/extension-forward.dto';
import { MailForwardDto } from './dto/mail-forward.dto';
import { QueueStatusDto } from './dto/queue-status.dto';
import { LoggerService } from '@app/logger/logger.service';
import { ChangeTypes, ExtensionForwardStatus, ServicesTypeToActionTypeMap } from './interfaces/additional-services.interface';
import { ServicesType } from './interfaces/additional-services.enum';
import { UtilsService } from '@app/utils/utils.service';
import { Pbx3cxForwardStatusService } from '@app/pbx3cx/pbx3cx-forward-status.service';
import { EXTENSION_NOT_FOUND, FWPROFILE_NOT_FOUND } from './additional-services.constants';
import { Dn, Extension, Fwdprofile } from '@app/pbx3cx/entities';
import { ForwardType } from '@app/pbx3cx/types/pbx3cx.enum';
import { AdditionalModelService, ExtensionForwardService } from './services';
import { ActionType } from '@app/selenoid/interfaces/selenoid.enum';
import { MailCheckForwardResult } from '@app/selenoid/providers/mail/mail.interfaces';

@Injectable()
export class AdditionalServicesService {
  private serviceContext: string;
  constructor(
    private readonly additionalModelService: AdditionalModelService,
    private readonly selenoid: SelenoidProvider,
    private readonly logger: LoggerService,
    private readonly pbxForward: Pbx3cxForwardStatusService,
    private readonly extensionForward: ExtensionForwardService,
  ) {
    this.serviceContext = AdditionalServicesService.name;
  }

  public async changeQueueStatus(data: QueueStatusDto): Promise<void> {
    return await this.change(ServicesType.queue, data);
  }

  public async changeExtensionForward(data: ExtensionForwardDto): Promise<void> {
    return await this.change(ServicesType.extension, data);
  }

  public async changeMailForward(data: MailForwardDto): Promise<void> {
    return await this.change(ServicesType.mail, data);
  }

  public async getExtenForwardStatus(exten: string): Promise<ExtensionForwardStatus> {
    try {
      const dn = await this.pbxForward.getExtenId(exten);
      if (dn == null) throw EXTENSION_NOT_FOUND;

      const extension = await this.pbxForward.getExtensionInfo(dn.iddn);
      const mobile = (await this.pbxForward.getCurrentExtenMobile(dn.iddn)).value;
      if (await this.isExtenStatusAvailable(extension))
        return {
          isForwardEnable: false,
        };
      return await this.getCurrentForwardInfo(await this.getForwardInfo(dn, extension), mobile);
    } catch (e) {
      throw e;
    }
  }

  public async getCurrentMailForward(email: string): Promise<MailCheckForwardResult> {
    try {
      return (await this.selenoid.action(ActionType.mailCheckForward, { email })) as MailCheckForwardResult;
    } catch (e) {
      throw e;
    }
  }

  private async getCurrentForwardInfo(currentForwardInfo: Fwdprofile, mobile: string): Promise<ExtensionForwardStatus> {
    return {
      isForwardEnable: true,
      ...(await this.extensionForward.getLocalExtensionForward(currentForwardInfo, mobile)),
    };
  }

  private async getForwardInfo(dn: Dn, extension: Extension): Promise<Fwdprofile> {
    const currentProfiles = await this.pbxForward.getExtenProfiles(dn.iddn);
    if (
      !currentProfiles.some((fwdprofile: Fwdprofile) => {
        return fwdprofile.idfwdprofile === extension.currentprofile;
      })
    )
      throw FWPROFILE_NOT_FOUND;
    return currentProfiles.filter((fwdprofile: Fwdprofile) => {
      return fwdprofile.idfwdprofile === extension.currentprofile;
    })[0];
  }

  private async isExtenStatusAvailable(extension: Extension): Promise<boolean> {
    const currentProf = await this.pbxForward.getExtenCurrentProfile(extension.currentprofile);
    return currentProf.profilename == ForwardType.available;
  }

  private async change(service: ServicesType, data: ChangeTypes): Promise<void> {
    try {
      await this.additionalModelService.create({ ...data, service });
      if (service === ServicesType.queue) {
        await this.selenoid.action(ServicesTypeToActionTypeMap[service], data);
      } else if (UtilsService.isDateNow(data.dateFrom)) {
        await this.selenoid.action(ServicesTypeToActionTypeMap[service], data);
      }
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}
