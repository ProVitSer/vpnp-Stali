import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { RemoteActivateDto } from './dto/remote-activate.dto';
import { RemoteActivateDtoWithId, RemoteDeactivateDtoWithId, RemoteResponse, UpdateRemoteStatusData } from './interfaces/remote-interface';
import { RemoteModel } from './remote.model';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { RemoteStatus } from './interfaces/remote-enum';
import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Types } from 'mongoose';
import { ActiveDirectoryService } from '@app/active-directory/active-directory.service';
import { AdActionTypes } from '@app/active-directory/interfaces/active-directory.enum';
import { UtilsService } from '@app/utils/utils.service';
import { RemoteDeleteDto } from './dto/remote-delete.dto';
import * as moment from 'moment';
import { RemoteDeactivateDto } from './dto/remote-deactivate.dto';
import { ActionType, EsetStatus } from '@app/selenoid/interfaces/selenoid.enum';
import { RemoteActualUserStatusDto } from './dto/remote-actual-user-status.dto';
import { DATE_FORMAT, FORMAT_INCOMING_DATE } from './remote..constants';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class RemoteModelService {
  constructor(@InjectModel(RemoteModel) private readonly remoteModel: ModelType<RemoteModel>) {}

  public async create(data: { [key: string]: any }): Promise<DocumentType<RemoteModel>> {
    return this.remoteModel.create(data);
  }

  public async updateById(id: string | Types.ObjectId, data: { [key: string]: any }) {
    return await this.remoteModel.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
  }

  public async findById(id: string) {
    return this.remoteModel.findById(id).exec();
  }

  public async deleteById(id: string) {
    return await this.remoteModel.findByIdAndRemove(id).exec();
  }

  public async findByCriteria(criteria: { [key: string]: any }): Promise<DocumentType<RemoteModel>[]> {
    return await this.remoteModel.find(criteria).exec();
  }
}

@Injectable()
export class RemoteService {
  private serviceContext: string;
  constructor(
    private readonly remoteModelService: RemoteModelService,
    private readonly selenoidProvider: SelenoidProvider,
    private readonly adService: ActiveDirectoryService,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = RemoteService.name;
  }

  public async remoteActivate(data: RemoteActivateDto): Promise<RemoteResponse> {
    const responseData = await this.gerRemoteDefaultResponse(data);
    if (UtilsService.isDateNow(data.dateFrom)) {
      this.activateRemoteAccess({ ...data, remoteId: responseData.remoteId });
    }

    return responseData;
  }

  public async remoteDeactivate(data: RemoteDeactivateDto): Promise<RemoteResponse> {
    const responseData = await this.gerRemoteDefaultResponse(data);
    this.deactivateRemoteAccess({ ...data, remoteId: responseData.remoteId });
    return responseData;
  }

  public async getRemoteAdUsers(): Promise<RemoteResponse> {
    const responseData = await this.gerRemoteDefaultResponse({});
    this.getAdUsers(responseData.remoteId);
    return responseData;
  }

  public async getRemoteStatus(id: string) {
    const result = await this.remoteModelService.findById(id);
    if (result === null)
      return {
        status: RemoteStatus.notFound,
      };
    return {
      remoteId: result._id,
      status: result.status,
      ...result.remoteData,
    };
  }

  public async deleteRemote(data: RemoteDeleteDto) {
    if (!!data.remoteId) {
      await this.remoteModelService.deleteById(data.remoteId);
    } else {
      await this.deleteByDate(data.dateFrom, data.dateTo);
    }
    return {
      status: RemoteStatus.completed,
    };
  }

  public async getActualRemoteStatus(data: RemoteActualUserStatusDto): Promise<RemoteResponse> {
    const responseData = await this.gerRemoteDefaultResponse({});
    this.getUserStatus({ ...data, remoteId: responseData.remoteId });
    return responseData;
  }

  private async getUserStatus(data: RemoteActualUserStatusDto & { remoteId: string | Types.ObjectId }) {
    try {
      const adUsers = await this.adService.getAdUsers();
      const isRemoteEsetActive = await this.selenoidProvider.change(ActionType.esetCheckRemoteAccess, { userName: data.user });
      await this.updateRemoteStatus({
        remoteId: data.remoteId,
        isRemoteAdActive: adUsers.data.some((adUser) => adUser === data.user),
        isRemoteEsetActive,
      });
    } catch (e) {
      await this.remoteModelService.updateById(data.remoteId, { remoteData: { error: String(e) }, status: RemoteStatus.apiFail });
    }
  }

  private async deleteByDate(dateFrom, dateTo) {
    const criteria = {
      createdAt: {
        $gte: new Date(moment(dateFrom, FORMAT_INCOMING_DATE).format(DATE_FORMAT)),
        $lte: new Date(moment(dateTo, FORMAT_INCOMING_DATE).endOf('day').format()),
      },
    };
    const remotes = await this.remoteModelService.findByCriteria(criteria);
    return await Promise.all(
      remotes.map(async (remote: DocumentType<RemoteModel>) => {
        await this.remoteModelService.deleteById(String(remote._id));
      }),
    );
  }

  private async getAdUsers(remoteId: string | Types.ObjectId) {
    try {
      const adUsers = await this.adService.getAdUsers();
      const updateInfo = {
        remoteData: { users: adUsers.data },
        status: RemoteStatus.completed,
      };
      await this.remoteModelService.updateById(remoteId, updateInfo);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      await this.remoteModelService.updateById(remoteId, { remoteData: { error: String(e) }, status: RemoteStatus.apiFail });
    }
  }

  public async activateRemoteAccess(data: RemoteActivateDtoWithId) {
    try {
      await this.adService.setAdRemoteStatus({ user: data.user, action: AdActionTypes.addRemoteAccess });
      await this.selenoidProvider.change(ActionType.esetSetRemoteAccess, {
        userName: data.user,
        phoneNumber: data.mobile,
        status: EsetStatus.on,
      });
      await this.updateRemoteStatus({ remoteId: data.remoteId, isRemoteAdActive: true, isRemoteEsetActive: true });
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      await this.remoteModelService.updateById(data.remoteId, { remoteData: { error: String(e) }, status: RemoteStatus.apiFail });
    }
  }

  public async deactivateRemoteAccess(data: RemoteDeactivateDtoWithId) {
    try {
      await this.adService.setAdRemoteStatus({ user: data.user, action: AdActionTypes.deleteRemoteAccess });
      await this.selenoidProvider.change(ActionType.esetSetRemoteAccess, {
        userName: data.user,
        status: EsetStatus.off,
      });
      await this.updateRemoteStatus({ remoteId: data.remoteId, isRemoteAdActive: false, isRemoteEsetActive: false });
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      await this.remoteModelService.updateById(data.remoteId, { remoteData: { error: String(e) }, status: RemoteStatus.apiFail });
    }
  }

  private async updateRemoteStatus(data: UpdateRemoteStatusData) {
    const { isRemoteAdActive, isRemoteEsetActive } = data;
    await this.remoteModelService.updateById(data.remoteId, {
      remoteData: { remoteStatus: { isRemoteAdActive, isRemoteEsetActive } },
      status: RemoteStatus.completed,
    });
  }

  private async gerRemoteDefaultResponse(data: { [key: string]: any }) {
    const { _id } = await this.remoteModelService.create(data);
    return {
      remoteId: _id,
      status: RemoteStatus.inProgress,
    };
  }
}
