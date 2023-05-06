import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { ExtensionForwardDto } from './dto/extension-forward.dto';
import { MailForwardDto } from './dto/mail-forward.dto';
import { QueueStatusDto } from './dto/queue-status.dto';
import { LoggerService } from '@app/logger/logger.service';
import { ChangeTypes, ExtensionForwardStatus, ServicesTypeToActionTypeMap } from './interfaces/additional-services.interface';
import { ServicesType } from './interfaces/additional-services.enum';
import { UtilsService } from '@app/utils/utils.service';
import { Pbx3cxService } from '@app/pbx3cx/pbx3cx.service';
import { Pbx3cxForwardStatusService } from '@app/pbx3cx/pbx3cx-forward-status.service';
import { EXTENSION_NOT_FOUND, FWPROFILE_NOT_FOUND } from './additional-services.constants';
import { Dn, Extension, Fwdprofile } from '@app/pbx3cx/entities';
import { ForwardType } from '@app/pbx3cx/types/pbx3cx.enum';
import { AdditionalModelService, ExtensionForwardService } from './services';

@Injectable()
export class AdditionalServicesService {
  private serviceContext: string;
  constructor(
    private readonly additionalModelService: AdditionalModelService,
    private readonly selenoid: SelenoidProvider,
    private readonly logger: LoggerService,
    private readonly pbx3cxService: Pbx3cxService,
    private readonly pbxForward: Pbx3cxForwardStatusService,
    private readonly extensionForward: ExtensionForwardService,
  ) {
    this.serviceContext = AdditionalServicesService.name;
  }

  public async changeQueueStatus(data: QueueStatusDto): Promise<boolean> {
    return await this.change(ServicesType.queue, data);
  }

  public async changeExtensionForward(data: ExtensionForwardDto): Promise<boolean> {
    return await this.change(ServicesType.extension, data);
  }

  public async changeMailForward(data: MailForwardDto): Promise<boolean> {
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

  private async change(service: ServicesType, data: ChangeTypes): Promise<boolean> {
    try {
      await this.additionalModelService.create({ ...data, service });
      if (service === ServicesType.queue) {
        await this.selenoid.action(ServicesTypeToActionTypeMap[service], data);
      } else if (UtilsService.isDateNow(data.dateFrom)) {
        await this.selenoid.action(ServicesTypeToActionTypeMap[service], data);
      }
      return true;
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}
