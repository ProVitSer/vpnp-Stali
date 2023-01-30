import { trunkLocalExtension } from '@app/config/trunk';
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from '@app/soap1c/interfaces/soap1c.enum';
import { Soap1cProvider } from '@app/soap1c/sopa1c.provider';
import { Injectable } from '@nestjs/common';
import { DialExtensionDto } from '../dto/dial-extension.dto';
import { AsteriskApiProviderInterface, CallInfo } from '../interfaces/asteriks-api.interface';
import * as moment from 'moment';

@Injectable()
export class DialExtension implements AsteriskApiProviderInterface {
  constructor(private readonly soap1c: Soap1cProvider) {}

  public async aggregateCallInfo(data: CallInfo): Promise<void> {
    const callData = data as DialExtensionDto;
    const dialedNumber = callData.context.length > 7 ? trunkLocalExtension[callData.context] : `8495${callData.context}`;
    await this.soap1c.request({
      action: Soap1cActionTypes.setNumber,
      data: {
        channelId: callData.unicueid,
        incomingNumber: callData.incomingNumber,
        dialedNumber,
        localExtension: callData.extension,
        callDateTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
      },
    });
    return;
  }
}
