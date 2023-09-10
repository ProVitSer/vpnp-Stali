import { Soap1cActionTypes } from '@app/soap1c/interfaces/soap1c.enum';
import { Soap1cProvider } from '@app/soap1c/sopa1c.provider';
import { Injectable } from '@nestjs/common';
import { DialExtensionDto } from '../dto/dial-extension.dto';
import { SmartRoutingApiProviderInterface } from '../interfaces/smart-routing-api.interface';
import * as moment from 'moment';
import { CALL_DATE_TIME_FORMAT } from '@app/soap1c/soap1c.constants';
import { SmartRoutingApiUtilsService } from '../smart-routing-api.utils';

@Injectable()
export class DialExtension implements SmartRoutingApiProviderInterface {
  constructor(private readonly soap1c: Soap1cProvider) {}

  public async sendAggregateCallInfo(data: DialExtensionDto): Promise<void> {
    try {
      return await this.soap1c.request({
        action: Soap1cActionTypes.setNumber,
        data: {
          channelId: data.unicueid,
          incomingNumber: SmartRoutingApiUtilsService.formatIncomingNumber(data.incomingNumber),
          dialedNumber: SmartRoutingApiUtilsService.formatDialExtensionByContext(data.context),
          localExtension: data.extension,
          callDateTime: moment().format(CALL_DATE_TIME_FORMAT),
        },
      });
    } catch (e) {
      throw e;
    }
  }
}
