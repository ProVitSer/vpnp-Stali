import { CallType } from './pbx3cx.enum';

export interface CallInfoEventData {
  unicueid: string;
  incomingNumber: string;
  extension: string;
}

export interface CallInfoData {
  callType: CallType;
  moduleUnicueId: string;
  pbx3cxUnicueId: number;
  destinationNumber: string;
  displayName?: string;
  outboundNumber?: string;
  startCallTime: Date;
  endCallTime: Date;
}
