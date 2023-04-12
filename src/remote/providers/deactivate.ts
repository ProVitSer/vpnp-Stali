import { ActiveDirectoryService } from '@app/active-directory/active-directory.service';
import { AdActionTypes } from '@app/active-directory/interfaces/active-directory.enum';
import { LoggerService } from '@app/logger/logger.service';
import { ActionType, EsetStatus } from '@app/selenoid/interfaces/selenoid.enum';
import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { RemoteActionDataCompleted, RemoteDeactivateDtoWithId, RemoteProviderInterface } from '../interfaces/remote-interface';

@Injectable()
export class DeactivateRemote implements RemoteProviderInterface {
  private serviceContext: string;
  constructor(
    private readonly adService: ActiveDirectoryService,
    private readonly selenoidProvider: SelenoidProvider,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = DeactivateRemote.name;
  }

  async remoteAction(data: RemoteDeactivateDtoWithId): Promise<RemoteActionDataCompleted> {
    try {
      return await this.deactivateRemoteAccess(data);
    } catch (e) {
      throw e;
    }
  }

  private async deactivateRemoteAccess(data: RemoteDeactivateDtoWithId) {
    try {
      await this.adService.setAdRemoteStatus({ user: data.user, action: AdActionTypes.deleteRemoteAccess });
      await this.selenoidProvider.action(ActionType.esetSetRemoteAccess, {
        userName: data.user,
        status: EsetStatus.off,
      });
      return { remoteId: data.remoteId, remoteData: { remoteStatus: { isRemoteAdActive: false, isRemoteEsetActive: false } } };
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}
