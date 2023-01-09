import { Injectable } from '@nestjs/common';
import { AsteriskApiProviderInterface, CallInfo } from '../interfaces/asteriks-api.interface';

@Injectable()
export class DialExtension implements AsteriskApiProviderInterface {
  aggregateCallInfo(data: CallInfo): Promise<void> {
    console.log(data);
    return;
  }
}
