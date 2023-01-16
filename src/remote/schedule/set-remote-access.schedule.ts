import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { RemoteModelService, RemoteService } from '../remote.service';
import { Cron } from '@nestjs/schedule';
import { format } from 'date-fns';
import { RemoteStatus, RemoteStatusChangeType, RemoteTaskType } from '../interfaces/remote-enum';
import { RemoteModel } from '../remote.model';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { RemoteActivateDtoWithId, RemoteChangeData } from '../interfaces/remote-interface';
import {
  DATE_FORMAT,
  DEFERRED__CHANGES_ACTIVATE_TIME,
  DEFERRED_CHANGES_DEACTIVATE_TIME,
  REMOTE_PROCESS_CHANGE,
  MAX_REMOTE_PROCESS,
} from '@app/config/app.config';

@Injectable()
export class SetRemoteAccessScheduleService {
  private serviceContext: string;
  private remoteQueue: string[] = [];
  constructor(
    private readonly logger: LoggerService,
    private readonly remoteService: RemoteService,
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
      await this.startChangeByType(result);
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
      await this.startChangeByType(result);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  @Cron(REMOTE_PROCESS_CHANGE)
  async setRemoteChangeInProgress() {
    try {
      const result = await this.remoteModelService.findByCriteria({
        remoteStatusChange: RemoteStatusChangeType.start,
        dateFrom: format(new Date(), DATE_FORMAT),
      });
      if (result.length === 0 || this.remoteQueue.length >= MAX_REMOTE_PROCESS) return;
      await this.addWorkToQueue(result);
      console.log(this.remoteQueue);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  @Cron(REMOTE_PROCESS_CHANGE)
  async startRemoteChange() {
    try {
      const result = await this.remoteModelService.findByCriteria({
        remoteStatusChange: RemoteStatusChangeType.progress,
        dateFrom: format(new Date(), DATE_FORMAT),
      });
      console.log(this.isRemoteChangeStart(result));
      if (result.length === 0 || this.isRemoteChangeStart(result)) return;
      await this.startChangeByType(result);
      this.remoteQueue.length = 0;
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  private isRemoteChangeStart(data: DocumentType<RemoteModel>[]): boolean {
    return data.every((d) => {
      return this.remoteQueue.includes(d._id.toString());
    });
  }

  private async addWorkToQueue(data: DocumentType<RemoteModel>[]): Promise<void> {
    await Promise.all(
      data.map(async (u) => {
        this.remoteQueue.push(u._id.toString());
        await this.remoteModelService.updateById(u._id, { remoteStatusChange: RemoteStatusChangeType.progress });
      }),
    );
  }

  private getRemoteAccessData(data: DocumentType<RemoteModel>): RemoteChangeData {
    switch (data.remoteTaskType) {
      case RemoteTaskType.activateRemote:
        return {
          remoteId: String(data._id),
          user: data.user,
          mobile: data.mobile,
          email: data.email,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo,
        };
      case RemoteTaskType.deactivateRemote:
        return {
          remoteId: String(data._id),
          user: data.user,
        };
      case RemoteTaskType.getUserStatus:
        return {
          remoteId: String(data._id),
          user: data.user,
        };
    }
  }

  private async startChangeByType(data: DocumentType<RemoteModel>[]): Promise<void> {
    await Promise.all(
      data.map(async (user) => {
        switch (user.remoteTaskType) {
          case RemoteTaskType.activateRemote:
            await this.remoteService.activateRemoteAccess({
              ...(this.getRemoteAccessData(user) as RemoteActivateDtoWithId),
            });
          case RemoteTaskType.deactivateRemote:
            await this.remoteService.deactivateRemoteAccess({ ...this.getRemoteAccessData(user) });
          case RemoteTaskType.getUserStatus:
            await this.remoteService.getUserStatus({ ...this.getRemoteAccessData(user) });
        }
      }),
    );
  }
}
