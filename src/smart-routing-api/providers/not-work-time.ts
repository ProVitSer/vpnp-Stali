import { Injectable } from '@nestjs/common';
import { SmartRoutingApiProviderInterface } from '../interfaces/smart-routing-api.interface';
import { OffHoursDto } from '../dto/off-hours.dto';
import { Soap1cProvider } from '@app/soap1c/sopa1c.provider';
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from '@app/soap1c/interfaces/soap1c.enum';
import { CALL_DATE_TIME_FORMAT } from '@app/soap1c/soap1c.constants';
import * as moment from 'moment';
import { SmartRoutingApiUtilsService } from '../smart-routing-api.utils';
import { ContextNumberToFull } from '@app/config/config';

@Injectable()
export class NotWorkTime implements SmartRoutingApiProviderInterface {
  constructor(private readonly soap1c: Soap1cProvider) {}

  async sendAggregateCallInfo(data: OffHoursDto): Promise<void> {
    try {
      return await this.soap1c.request({
        action: Soap1cActionTypes.getRouteNumber,
        envelop: Soap1cEnvelopeTypes.returnNumber,
        data: {
          incomingNumber: SmartRoutingApiUtilsService.formatIncomingNumber(data.incomingNumber),
          dialedNumber: ContextNumberToFull[data.dialExtension],
          channelId: '',
          callDateTime: moment().format(CALL_DATE_TIME_FORMAT),
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
