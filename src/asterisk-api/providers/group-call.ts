import { Injectable } from '@nestjs/common';
import { AsteriskApiProviderInterface, CallInfo } from '../interfaces/asteriks-api.interface';

@Injectable()
export class GroupCall implements AsteriskApiProviderInterface {
  aggregateCallInfo(data: CallInfo): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
