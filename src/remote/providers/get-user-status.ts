import { ActiveDirectoryService } from '@app/active-directory/active-directory.service';
import { LoggerService } from '@app/logger/logger.service';
import { ActionType } from '@app/selenoid/interfaces/selenoid.enum';
import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { RemoteActionDataCompleted, RemoteActualUserStatusDtoWithId, RemoteProviderInterface } from '../interfaces/remote-interface';

@Injectable()
export class GetUserStatusRemote implements RemoteProviderInterface {
  private serviceContext: string;
  constructor(
    private readonly adService: ActiveDirectoryService,
    private readonly selenoidProvider: SelenoidProvider,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = GetUserStatusRemote.name;
  }

  async remoteAction(data: RemoteActualUserStatusDtoWithId): Promise<RemoteActionDataCompleted> {
    try {
      return await this.getUserStatus(data);
    } catch (e) {
      throw e;
    }
  }

  private async getUserStatus(data: RemoteActualUserStatusDtoWithId) {
    try {
      const adUsers = await this.adService.getAdUsers();
      const isRemoteEsetActive = await this.selenoidProvider.change(ActionType.esetCheckRemoteAccess, { userName: data.user });
      return {
        remoteId: data.remoteId,
        remoteData: { remoteStatus: { isRemoteAdActive: adUsers.data.some((adUser) => adUser === data.user), isRemoteEsetActive } },
      };
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}
