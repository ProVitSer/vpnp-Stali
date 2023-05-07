import { DATE_TIME_3CX_FORMAT, MIN_CALL_SECOND } from '@app/config/app.config';
import { IdTrunk3CXToNumber } from '@app/config/config';
import { CallMobileInfoData } from '@app/pbx3cx/types/pbx3cx.interface';
import { SetIDData } from '@app/soap1c/interfaces/soap1c.interface';
import { CALL_DATE_TIME_FORMAT } from '@app/soap1c/soap1c.constants';
import { UtilsService } from '@app/utils/utils.service';
import moment from 'moment';

export function getMobileInfo(call3cxInfo: CallMobileInfoData): SetIDData {
  const { destinationNumber, displayName } = call3cxInfo;
  const callSecondTime = UtilsService.secondDiff(call3cxInfo.startCallTime, call3cxInfo.endCallTime, DATE_TIME_3CX_FORMAT);
  if (!!destinationNumber && destinationNumber.length > 4 && displayName.length > 4) {
    return {
      channelId: call3cxInfo.moduleUnicueId,
      unicue3cxId: String(call3cxInfo.pbx3cxUnicueId),
      dialedNumber: callSecondTime < MIN_CALL_SECOND ? 'shortCall' : displayName,
      localExtension: '000',
      incomingNumber: IdTrunk3CXToNumber[destinationNumber] || undefined,
      callDateTime: moment(call3cxInfo.startCallTime).format(CALL_DATE_TIME_FORMAT),
    };
  } else {
    return {
      channelId: call3cxInfo.moduleUnicueId,
      unicue3cxId: String(call3cxInfo.pbx3cxUnicueId),
      dialedNumber: '000',
      localExtension: callSecondTime < MIN_CALL_SECOND ? 'shortCall' : displayName,
      incomingNumber: '000',
      callDateTime: moment(call3cxInfo.startCallTime).format(CALL_DATE_TIME_FORMAT),
    };
  }
}
