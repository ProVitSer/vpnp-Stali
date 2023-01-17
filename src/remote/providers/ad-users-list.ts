import { ActiveDirectoryService } from '@app/active-directory/active-directory.service';
import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { RemoteActionDataCompleted, RemoteDeactivateDtoWithId, RemoteProviderInterface } from '../interfaces/remote-interface';

@Injectable()
export class AdUsersListRemote implements RemoteProviderInterface {
  private serviceContext: string;
  constructor(private readonly adService: ActiveDirectoryService, private readonly logger: LoggerService) {
    this.serviceContext = AdUsersListRemote.name;
  }

  async remoteAction(data: RemoteDeactivateDtoWithId): Promise<RemoteActionDataCompleted> {
    try {
      return await this.getAdUsers(String(data.remoteId));
    } catch (e) {
      throw e;
    }
  }

  private async getAdUsers(remoteId: string) {
    try {
      const adUsers = await this.adService.getAdUsers();
      return { remoteId, remoteData: { users: adUsers.data } };
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}
