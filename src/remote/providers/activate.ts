import { ActiveDirectoryService } from '@app/active-directory/active-directory.service';
import { AdActionTypes } from '@app/active-directory/interfaces/active-directory.enum';
import { LoggerService } from '@app/logger/logger.service';
import { ActionType, EsetStatus } from '@app/selenoid/interfaces/selenoid.enum';
import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { RemoteActionDataCompleted, RemoteActivateDtoWithId, RemoteProviderInterface } from '../interfaces/remote-interface';

@Injectable()
export class ActivateRemote implements RemoteProviderInterface {
  private serviceContext: string;
  constructor(
    private readonly adService: ActiveDirectoryService,
    private readonly selenoidProvider: SelenoidProvider,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = ActivateRemote.name;
  }

  async remoteAction(data: RemoteActivateDtoWithId): Promise<RemoteActionDataCompleted> {
    try {
      return await this.activateRemoteAccess(data);
    } catch (e) {
      throw e;
    }
  }

  private async activateRemoteAccess(data: RemoteActivateDtoWithId) {
    try {
      await this.adService.setAdRemoteStatus({ user: data.user, action: AdActionTypes.addRemoteAccess });
      await this.selenoidProvider.change(ActionType.esetSetRemoteAccess, {
        userName: data.user,
        phoneNumber: data.mobile,
        status: EsetStatus.on,
      });
      return { remoteId: data.remoteId, remoteData: { remoteStatus: { isRemoteAdActive: true, isRemoteEsetActive: true } } };
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}
