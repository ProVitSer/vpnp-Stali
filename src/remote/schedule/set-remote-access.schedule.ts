import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { format } from 'date-fns';
import { RemoteActionType, RemoteStatus } from '../interfaces/remote-enum';
import { DATE_FORMAT, DEFERRED__CHANGES_ACTIVATE_TIME, DEFERRED_CHANGES_DEACTIVATE_TIME } from '@app/config/app.config';
import { RemoteMessageQueueService } from '../remote-message-queue.service';
import { RemoteModelService } from '../services/remote-model-service';

@Injectable()
export class SetRemoteAccessScheduleService {
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly remoteModelService: RemoteModelService,
    private readonly remoteMessage: RemoteMessageQueueService,
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
          await this.remoteMessage.publish({ remoteId: user._id, status: user.status, remoteActionType: RemoteActionType.activateRemote });
        }),
      );
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  @Cron(DEFERRED_CHANGES_DEACTIVATE_TIME)
  async defChangesDeactivateRemoteAccess() {
    if (!process.env.NODE_APP_INSTANCE || Number(process.env.NODE_APP_INSTANCE) === 0) {
      try {
        const result = await this.remoteModelService.findByCriteria({
          status: RemoteStatus.completed,
          dateTo: format(new Date(), DATE_FORMAT),
        });
        if (result.length === 0) return;
        await Promise.all(
          result.map(async (user) => {
            await this.remoteMessage.publish({
              remoteId: user._id,
              status: user.status,
              remoteActionType: RemoteActionType.deactivateRemote,
            });
          }),
        );
      } catch (e) {
        this.logger.error(e, this.serviceContext);
      }
    }
  }
}
