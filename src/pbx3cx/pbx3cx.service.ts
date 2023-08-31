import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Pbx3cxCallInfoService } from './pbx3cx-call-info.service';
import { CallInfoData, CallInfoEventData, CallMobileInfoData } from './types/pbx3cx.interface';
import { CallType } from './types/pbx3cx.enum';
import { ClParticipants } from './entities';

@Injectable()
export class Pbx3cxService {
  private serviceContext: string;
  constructor(private readonly pbxCallService: Pbx3cxCallInfoService, private readonly logger: LoggerService) {
    this.serviceContext = Pbx3cxService.name;
  }

  public async search3cxExtensionCall(data: CallInfoEventData): Promise<CallInfoData | CallMobileInfoData> {
    try {
      const { unicueid, incomingNumber, extension } = data;
      this.logger.info(`${unicueid} ${incomingNumber} ${extension}`, this.serviceContext);
      const callInfo = await this.getCallInfo(incomingNumber);
      const answerCalls = await this.pbxCallService.searchAnswerByCallID(callInfo.callId);

      if (answerCalls.length == 0) return await await this.search3cxInfoMobileRedirection(unicueid, callInfo.callId);

      const clParticipantsInfoIds = answerCalls.map((answerCalls: { cl_participants_info_id: number }) => {
        return answerCalls.cl_participants_info_id;
      });

      const callUserInfo = await this.pbxCallService.searchLastUserRing(clParticipantsInfoIds, extension.trim());

      if (callUserInfo !== null) {
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
      throw e;
    }
  }

  public async search3cxGroupCall(data: Omit<CallInfoEventData, 'extension'>): Promise<CallInfoData | CallMobileInfoData> {
    try {
      const { unicueid, incomingNumber } = data;

      const modIncomingNumber = incomingNumber.length == 12 ? incomingNumber.substring(1) : incomingNumber;
      this.logger.info(`${modIncomingNumber}`, this.serviceContext);

      const callInfo = await this.getCallInfo(modIncomingNumber);

      const callCenterCallInfo = await this.pbxCallService.getCallCenterInfo(modIncomingNumber);

      if (callCenterCallInfo === null) {
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
      throw e;
    }
  }

  public async getAllMeetings() {
    try {
      return await this.pbxCallService.getAllMeetings();
    } catch (e) {
      throw e;
    }
  }

  private async search3cxInfoMobileRedirection(unicueid: string, callId: number): Promise<CallMobileInfoData> {
    try {
      const infoId = await this.pbxCallService.searcInfoId(callId);
      const callPartyInfo = await this.pbxCallService.searchCallPartyInfo(infoId.infoId);
      const callParticipants = await this.pbxCallService.searchCallInfo(infoId.infoId);
      return {
        callType: CallType.mobile,
        moduleUnicueId: unicueid,
        pbx3cxUnicueId: callParticipants.callId, //infoId.callId,
        destinationNumber: callPartyInfo.dn,
        displayName: callPartyInfo.displayName,
        startCallTime: callParticipants.startTime,
        endCallTime: callParticipants.endTime,
      };
    } catch (e) {
      throw e;
    }
  }

  private async getCallInfo(incomingNumber: string): Promise<ClParticipants> {
    try {
      const callPartyInfo = await this.pbxCallService.searchFirstIncomingIdByNumber(incomingNumber.trim());
      return await this.pbxCallService.searchCallInfo(callPartyInfo.id);
    } catch (e) {
      throw e;
    }
  }
}
