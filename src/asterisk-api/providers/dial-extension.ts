import { Soap1cActionTypes } from '@app/soap1c/interfaces/soap1c.enum';
import { Soap1cProvider } from '@app/soap1c/sopa1c.provider';
import { Injectable } from '@nestjs/common';
import { DialExtensionDto } from '../dto/dial-extension.dto';
import { AsteriskApiProviderInterface } from '../interfaces/asteriks-api.interface';
import * as moment from 'moment';
import { CALL_DATE_TIME_FORMAT } from '@app/soap1c/soap1c.constants';
import { AsteriskApiUtilsService } from '../asterisk-api.utils';

@Injectable()
export class DialExtension implements AsteriskApiProviderInterface {
  constructor(private readonly soap1c: Soap1cProvider) {}

  public async sendAggregateCallInfo(data: DialExtensionDto): Promise<void> {
    return await this.soap1c.request({
      action: Soap1cActionTypes.setNumber,
      data: {
        channelId: data.unicueid,
        incomingNumber: AsteriskApiUtilsService.formatIncomingNumber(data.incomingNumber),
        dialedNumber: AsteriskApiUtilsService.formatDialExtensionByContext(data.context),
        localExtension: data.extension,
        callDateTime: moment().format(CALL_DATE_TIME_FORMAT),
      },
    });
  }
}
