import { Injectable } from '@nestjs/common';
import { SmartRoutingApiProviderInterface } from '../interfaces/smart-routing-api.interface';
import { GroupCallDto } from '../dto/group-call.dto';
import { Pbx3cxService } from '@app/pbx3cx/pbx3cx.service';
import { Soap1cProvider } from '@app/soap1c/sopa1c.provider';
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from '@app/soap1c/interfaces/soap1c.enum';
import { SetIDData } from '@app/soap1c/interfaces/soap1c.interface';
import { CallInfoData, CallMobileInfoData } from '@app/pbx3cx/types/pbx3cx.interface';
import { CallType } from '@app/pbx3cx/types/pbx3cx.enum';
import { UtilsService } from '@app/utils/utils.service';
import { DATE_TIME_3CX_FORMAT, MIN_CALL_SECOND } from '@app/config/app.config';
import * as moment from 'moment';
import { CALL_DATE_TIME_FORMAT } from '@app/soap1c/soap1c.constants';
import { getMobileInfo } from './mobile-call';
import { DEFAULT_SHORT_NUMBER, DEFAULT_SHOWT_NAME, DEFAULT_TIMEOUT } from '../smart-routing-api.constants';

@Injectable()
export class GroupCall implements SmartRoutingApiProviderInterface {
  constructor(private readonly soap1c: Soap1cProvider, private readonly pbx3cxService: Pbx3cxService) {}

  async sendAggregateCallInfo(data: GroupCallDto): Promise<void> {
    try {
      await UtilsService.timeout(DEFAULT_TIMEOUT);
      const call3cxInfo = await this.pbx3cxService.search3cxGroupCall(data);
      return await this.soap1c.request({
        action: Soap1cActionTypes.setID,
        envelop: Soap1cEnvelopeTypes.returnNumber,
        data: { ...this.getRequestData(call3cxInfo) },
      });
    } catch (e) {
      throw e;
    }
  }

  private getRequestData(call3cxInfo: CallInfoData): SetIDData {
    switch (call3cxInfo.callType) {
      case CallType.group:
        return this.getGroupInfo(call3cxInfo);
      case CallType.mobile:
        return getMobileInfo(call3cxInfo as CallMobileInfoData);
      default:
        throw `Неизвестный тип ${JSON.stringify(call3cxInfo)}`;
    }
  }

  private getGroupInfo(call3cxInfo: CallInfoData): SetIDData {
    const callSecondTime = UtilsService.secondDiff(call3cxInfo.startCallTime, call3cxInfo.endCallTime, DATE_TIME_3CX_FORMAT);
    return {
      channelId: call3cxInfo.moduleUnicueId,
      unicue3cxId: String(call3cxInfo.pbx3cxUnicueId),
      dialedNumber: DEFAULT_SHORT_NUMBER,
      localExtension: callSecondTime < MIN_CALL_SECOND ? DEFAULT_SHOWT_NAME : call3cxInfo.destinationNumber,
      incomingNumber: DEFAULT_SHORT_NUMBER,
      callDateTime: moment(call3cxInfo.startCallTime).format(CALL_DATE_TIME_FORMAT),
    };
  }
}
