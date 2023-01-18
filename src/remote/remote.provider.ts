import { LoggerService } from '@app/logger/logger.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { RemoteActionType, RemoteStatus, RemoteStatusChangeType } from './interfaces/remote-enum';
import {
  RemoteActionDataCompleted,
  RemoteChangeData,
  RemoteProviderData,
  RemoteProviderInterface,
  RemoteProviders,
} from './interfaces/remote-interface';
import { AdUsersListRemote, ActivateRemote, DeactivateRemote, GetUserStatusRemote } from './providers';
import { PROVIDER_NOT_EXISTS } from './remote.constants';
import { RemoteModel } from './remote.model';
import { RemoteModelService } from './remote.service';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { UtilsService } from '@app/utils/utils.service';

@Injectable()
export class RemoteProvider {
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    @Inject(forwardRef(() => RemoteModelService))
    private readonly remoteModelService: RemoteModelService,
    private readonly activate: ActivateRemote,
    private readonly deactivate: DeactivateRemote,
    private readonly getUserStatus: GetUserStatusRemote,
    private readonly adUsersList: AdUsersListRemote,
  ) {
    this.serviceContext = RemoteProvider.name;
  }

  private get providers(): RemoteProviders {
    return {
      [RemoteActionType.activateRemote]: this.activate,
      [RemoteActionType.deactivateRemote]: this.deactivate,
      [RemoteActionType.getUserStatus]: this.getUserStatus,
      [RemoteActionType.adUsersList]: this.adUsersList,
    };
  }

  public async action(data: RemoteProviderData): Promise<void> {
    try {
      const provider = this.getProvider(data.remoteActionType);
      const actionData = await this.getData(String(data.remoteId));
      const complitedData = await provider.remoteAction(this.getRemoteAccessData(actionData));
      return await this.updateRemoteCompleted(complitedData, actionData);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      await this.remoteModelService.updateById(data.remoteId, {
        remoteData: { error: String(e) },
        status: RemoteStatus.apiFail,
        remoteStatusChange: RemoteStatusChangeType.end,
      });
      throw e;
    }
  }

  private getProvider(remoteActionType: RemoteActionType): RemoteProviderInterface {
    if (!this.providerExists(remoteActionType)) {
      throw PROVIDER_NOT_EXISTS;
    }
    return this.providers[remoteActionType];
  }

  private providerExists(remoteActionType: RemoteActionType): boolean {
    return remoteActionType in this.providers;
  }

  private async getData(remoteId: string) {
    return await this.remoteModelService.findById(remoteId);
  }

  private async updateRemoteCompleted(dataCompleted: RemoteActionDataCompleted, actionData: DocumentType<RemoteModel>) {
    await this.remoteModelService.updateById(dataCompleted.remoteId, {
      remoteData: dataCompleted.remoteData,
      status: RemoteStatus.completed,
      remoteStatusChange: UtilsService.isDateNow(actionData.dateTo) ? RemoteStatusChangeType.end : RemoteStatusChangeType.progress,
    });
  }

  private getRemoteAccessData(data: DocumentType<RemoteModel>): RemoteChangeData {
    switch (data.remoteActionType) {
      case RemoteActionType.activateRemote:
        return {
          remoteId: String(data._id),
          user: data.user,
          mobile: data.mobile,
          email: data.email,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
        };
      case RemoteActionType.deactivateRemote:
        return {
          remoteId: String(data._id),
          user: data.user,
        };
      case RemoteActionType.getUserStatus:
        return {
          remoteId: String(data._id),
          user: data.user,
        };
      case RemoteActionType.adUsersList:
        return {
          remoteId: String(data._id),
        };
      default:
        break;
    }
  }
}
