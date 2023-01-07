export interface CallInfoEventData {
  unicueid: string;
  incomingNumber: string;
  extension: string;
}

export interface CallInfoData {
  kind: KindCall;
  moduleUnicueId: string;
  pbx3cxUnicueId: number;
  destinationNumber: string;
  displayName?: string;
  outboundNumber?: string;
  startCallTime: Date;
  endCallTime: Date;
}

export enum KindCall {
  local = 'local',
  mobile = 'mobile',
  group = 'group',
}
