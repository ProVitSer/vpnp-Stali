import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { RemoteModelService } from '../remote.service';
import { Cron } from '@nestjs/schedule';
import { format } from 'date-fns';
import { RemoteStatus } from '../interfaces/remote-enum';
import { DATE_FORMAT, DEFERRED__CHANGES_ACTIVATE_TIME, DEFERRED_CHANGES_DEACTIVATE_TIME } from '@app/config/app.config';
import { RemoteProvider } from '../remote.provider';

@Injectable()
export class SetRemoteAccessScheduleService {
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly remoteProvider: RemoteProvider,
    private readonly remoteModelService: RemoteModelService,
  ) {
    this.serviceContext = SetRemoteAccessScheduleService.name;
  }

  @Cron(DEFERRED__CHANGES_ACTIVATE_TIME)
  async defChangesActivateRemoteAccess() {
    try {
      const result = await this.remoteModelService.findByCriteria({
        status: RemoteStatus.inProgress,
        dateFrom: format(new Date(), DATE_FORMAT),
      });
      if (result.length === 0) return;
      await Promise.all(
        result.map(async (user) => {
          await this.remoteProvider.action({ remoteId: user._id, status: user.status, remoteActionType: user.remoteActionType });
        }),
      );
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  @Cron(DEFERRED_CHANGES_DEACTIVATE_TIME)
  async defChangesDeactivateRemoteAccess() {
    try {
      const result = await this.remoteModelService.findByCriteria({
        status: RemoteStatus.completed,
        dateTo: format(new Date(), DATE_FORMAT),
      });
      if (result.length === 0) return;
      await Promise.all(
        result.map(async (user) => {
          await this.remoteProvider.action({ remoteId: user._id, status: user.status, remoteActionType: user.remoteActionType });
        }),
      );
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }
}
