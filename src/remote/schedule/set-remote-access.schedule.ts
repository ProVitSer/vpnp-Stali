import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { RemoteModelService, RemoteService } from '../remote.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { format } from 'date-fns';
import { RemoteAccessStatus, RemoteStatus } from '../interfaces/remote-enum';
import { RemoteModel } from '../remote.model';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { RemoteActivateDtoWithId, RemoteChangeData } from '../interfaces/remote-interface';

@Injectable()
export class SetRemoteAccessScheduleService {
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly remoteService: RemoteService,
    private readonly remoteModelService: RemoteModelService,
  ) {
    this.serviceContext = SetRemoteAccessScheduleService.name;
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async activateRemoteAccess() {
    try {
      const result = await this.remoteModelService.findByCriteria({
        status: RemoteStatus.inProgress,
        dateFrom: format(new Date(), 'dd.MM.yyyy'),
      });
      if (result.length === 0) return;
      await Promise.all(
        result.map(async (user) => {
          await this.remoteService.activateRemoteAccess({
            ...(this.getRemoteAccessData(user, RemoteAccessStatus.activate) as RemoteActivateDtoWithId),
          });
        }),
      );
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deactivateRemoteAccess() {
    try {
      const result = await this.remoteModelService.findByCriteria({
        status: RemoteStatus.completed,
        dateTo: format(new Date(), 'dd.MM.yyyy'),
      });
      if (result.length === 0) return;
      await Promise.all(
        result.map(async (user) => {
          await this.remoteService.deactivateRemoteAccess({ ...this.getRemoteAccessData(user, RemoteAccessStatus.deactivate) });
        }),
      );
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  private getRemoteAccessData(data: DocumentType<RemoteModel>, remoteStatus: RemoteAccessStatus): RemoteChangeData {
    switch (remoteStatus) {
      case RemoteAccessStatus.activate:
        return {
          remoteId: String(data._id),
          user: data.user,
          mobile: data.mobile,
          email: data.email,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
        };
      case RemoteAccessStatus.deactivate:
        return {
          remoteId: String(data._id),
          user: data.user,
        };
    }
  }
}
