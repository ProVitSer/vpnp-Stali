import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { AdditionalServicesModel } from './additional-services..model';
import { ExtensionForwardDto } from './dto/extension-forward.dto';
import { MailForwardDto } from './dto/mail-forward.dto';
import { QueueStatusDto } from './dto/queue-status.dto';
import { Types } from 'mongoose';
import { LoggerService } from '@app/logger/logger.service';
import { ChangeTypes, ExtensionForwardStatus, ServicesTypeToActionTypeMap } from './interfaces/additional-services.interface';
import { ServicesType } from './interfaces/additional-services.enum';
import { UtilsService } from '@app/utils/utils.service';
import { Pbx3cxService } from '@app/pbx3cx/pbx3cx.service';
import { Pbx3cxForwardStatusService } from '@app/pbx3cx/pbx3cx-forward-status.service';
import { EXTENSION_NOT_FOUND } from './additional-services.constants';
import { Dn, Extension } from '@app/pbx3cx/entities';
import { ForwardType } from '@app/pbx3cx/types/pbx3cx.enum';

@Injectable()
export class AdditionalServicesModelService {
  constructor(@InjectModel(AdditionalServicesModel) private readonly additionalServicesModel: ModelType<AdditionalServicesModel>) {}

  public async create(data: { [key: string]: any }): Promise<DocumentType<AdditionalServicesModel>> {
    return await this.additionalServicesModel.create(data);
  }

  public async updateById(id: string | Types.ObjectId, data: { [key: string]: any }) {
    return await this.additionalServicesModel.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
  }

  public async findById(id: string) {
    return this.additionalServicesModel.findById(id).exec();
  }

  public async findByCriteria(criteria: { [key: string]: any }): Promise<DocumentType<AdditionalServicesModel>[]> {
    return await this.additionalServicesModel.find(criteria).exec();
  }
}

@Injectable()
export class AdditionalServicesService {
  private serviceContext: string;
  constructor(
    private readonly additionalServicesModel: AdditionalServicesModelService,
    private readonly selenoid: SelenoidProvider,
    private readonly logger: LoggerService,
    private readonly pbx3cxService: Pbx3cxService,
    private readonly pbxForward: Pbx3cxForwardStatusService,
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

  public async getExtenForwardStatus(exten: string): Promise<any> {
    try {
      const dn = await this.pbxForward.getExtenId(exten);
      if (dn == null) throw EXTENSION_NOT_FOUND;

      const extension = await this.pbxForward.getExtensionInfo(dn.iddn);

      if (await this.isExtenStatusAvailable(dn, extension))
        return {
          isForwardEnable: true,
        };

      //return await this.getForwardInfo(dn, extension);
    } catch (e) {
      throw e;
    }
  }

  // private async getForwardInfo(dn: Dn, extension: Extension): Promise<ExtensionForwardStatus> {
  //   const currentProfs = await this.pbxForward.getExtenProfiles(dn.iddn);
  // }

  private async isExtenStatusAvailable(dn: Dn, extension: Extension): Promise<boolean> {
    const currentProf = await this.pbxForward.getExtenCurrentProfile(extension.currentprofile);
    return currentProf.profilename == ForwardType.available;
  }

  private async change(service: ServicesType, data: ChangeTypes): Promise<boolean> {
    try {
      await this.additionalServicesModel.create({ ...data, service });
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
