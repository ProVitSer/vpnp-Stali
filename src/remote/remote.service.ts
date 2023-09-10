import { Injectable } from '@nestjs/common';
import { RemoteActivateDto } from './dto/remote-activate.dto';
import { RemoteResponse } from './interfaces/remote-interface';
import { RemoteModel } from './remote.model';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { RemoteStatus, RemoteStatusChangeType, RemoteActionType } from './interfaces/remote-enum';
import { RemoteDeleteDto } from './dto/remote-delete.dto';
import * as moment from 'moment';
import { RemoteDeactivateDto } from './dto/remote-deactivate.dto';
import { RemoteActualUserStatusDto } from './dto/remote-actual-user-status.dto';
import { REMOTE_DATE_FORMAT, FORMAT_INCOMING_DATE } from './remote.constants';
import { RemoteMessageQueueService } from './remote-message-queue.service';
import { UtilsService } from '@app/utils/utils.service';
import { RemoteModelService } from './services/remote-model-service';

@Injectable()
export class RemoteService {
  constructor(private readonly remoteModelService: RemoteModelService, private readonly remoteMessage: RemoteMessageQueueService) {}

  public async remoteActivate(data: RemoteActivateDto): Promise<RemoteResponse> {
    const responseData = await this.gerRemoteDefaultResponse(data, {
      remoteActionType: RemoteActionType.activateRemote,
      remoteStatusChange: RemoteStatusChangeType.start,
    });
    if (UtilsService.isDateNow(data.dateFrom)) {
      await this.remoteMessage.publish({ ...responseData, remoteActionType: RemoteActionType.activateRemote });
    }
    return responseData;
  }

  public async remoteDeactivate(data: RemoteDeactivateDto): Promise<RemoteResponse> {
    const responseData = await this.gerRemoteDefaultResponse(data, {
      remoteActionType: RemoteActionType.deactivateRemote,
      remoteStatusChange: RemoteStatusChangeType.start,
    });
    await this.remoteMessage.publish({ ...responseData, remoteActionType: RemoteActionType.deactivateRemote });
    return responseData;
  }

  public async getRemoteAdUsers(): Promise<RemoteResponse> {
    const responseData = await this.gerRemoteDefaultResponse({}, { remoteActionType: RemoteActionType.adUsersList });
    await this.remoteMessage.publish({ ...responseData, remoteActionType: RemoteActionType.adUsersList });
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
    const responseData = await this.gerRemoteDefaultResponse(data, {
      remoteActionType: RemoteActionType.getUserStatus,
      remoteStatusChange: RemoteStatusChangeType.start,
    });
    await this.remoteMessage.publish({ ...responseData, remoteActionType: RemoteActionType.getUserStatus });
    return responseData;
  }

  private async deleteByDate(dateFrom: string, dateTo: string) {
    const criteria = {
      createdAt: {
        $gte: new Date(moment(dateFrom, FORMAT_INCOMING_DATE).format(REMOTE_DATE_FORMAT)),
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

  private async gerRemoteDefaultResponse(data: { [key: string]: any }, fields?: { [key: string]: any }) {
    const { _id } = await this.remoteModelService.create({ ...data, ...fields });
    return {
      remoteId: _id,
      status: RemoteStatus.inProgress,
    };
  }
}
