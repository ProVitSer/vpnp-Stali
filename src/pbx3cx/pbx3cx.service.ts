import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Pbx3cxCallInfoService } from './pbx3cx-call-info.service';
import { CallInfoData, CallInfoEventData } from './types/pbx3cx.interface';
import { Pbx3cxForwardStatusService } from './pbx3cx-forward-status.service';
import { CallType } from './types/pbx3cx.enum';

@Injectable()
export class Pbx3cxService {
  private serviceContext: string;
  constructor(private readonly pbxCallService: Pbx3cxCallInfoService, private readonly logger: LoggerService) {
    this.serviceContext = Pbx3cxService.name;
  }

  public async search3cxExtensionCall(data: CallInfoEventData): Promise<CallInfoData> {
    try {
      const { unicueid, incomingNumber, extension } = data;
      this.logger.info(`${unicueid} ${incomingNumber} ${extension}`, this.serviceContext);
      const callInfo = await this.getCallInfo(incomingNumber);
      const answerCalls = await this.pbxCallService.searchAnswerByCallID(callInfo.callId);
      const mapAnswerCalls = answerCalls.map((answerCalls: { cl_participants_info_id: number }) => {
        return answerCalls.cl_participants_info_id;
      });
      const callUserInfo = await this.pbxCallService.searchLastUserRing(mapAnswerCalls, extension.trim());
      if (!!callUserInfo) {
        return {
          callType: CallType.local,
          moduleUnicueId: data.unicueid,
          pbx3cxUnicueId: callInfo.callId,
          destinationNumber: callUserInfo.dn,
          startCallTime: callInfo.startTime,
          endCallTime: callInfo.endTime,
        };
      } else {
        return await this.search3cxInfoMobileRedirection(unicueid, callInfo.callId);
      }
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  public async search3cxGroupCall(data: CallInfoEventData): Promise<CallInfoData> {
    try {
      const { unicueid, incomingNumber, extension } = data;
      this.logger.info(`${unicueid} ${incomingNumber} ${extension}`);
      const modIncomingNumber = incomingNumber.length == 12 ? incomingNumber.substring(1) : incomingNumber;
      const callInfo = await this.getCallInfo(modIncomingNumber);
      const callCenterCallInfo = await this.pbxCallService.getCallcenterInfo(modIncomingNumber);
      if (!callCenterCallInfo.callHistoryId || callCenterCallInfo.toDialednum == '') {
        return await this.search3cxInfoMobileRedirection(unicueid, callInfo.callId);
      } else {
        return {
          callType: CallType.group,
          moduleUnicueId: data.unicueid,
          pbx3cxUnicueId: callInfo.callId,
          destinationNumber: callCenterCallInfo.toDialednum,
          startCallTime: callInfo.startTime,
          endCallTime: callInfo.endTime,
        };
      }
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  public async getAllMeetings() {
    try {
      return await this.pbxCallService.getAllMeetings();
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  private async search3cxInfoMobileRedirection(unicueid: string, callId: number): Promise<CallInfoData> {
    try {
      const infoId = await this.pbxCallService.searcInfoId(callId);
      const callPartyInfo = await this.pbxCallService.searchCallPartyInfo(infoId.infoId);
      const callParticipants = await this.pbxCallService.searchCallInfo(infoId.infoId);
      return {
        callType: CallType.mobile,
        moduleUnicueId: unicueid,
        pbx3cxUnicueId: callParticipants.callId, //infoId.callId,
        destinationNumber: callPartyInfo.dn, //callPartyInfo.displayName,
        startCallTime: callParticipants.startTime,
        endCallTime: callParticipants.endTime,
      };
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  // private formatCallInfoData(): CallInfoData {}

  private async getCallInfo(incomingNumber: string) {
    try {
      const callPartyInfo = await this.pbxCallService.searchFirstIncomingIdByNumber(incomingNumber.trim());
      return await this.pbxCallService.searchCallInfo(callPartyInfo.id);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }
}
