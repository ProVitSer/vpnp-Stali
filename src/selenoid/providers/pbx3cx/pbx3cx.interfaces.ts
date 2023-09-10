import { ForwardRuleType } from './pbx3cx.enum';

export interface QueueStatusData {
  exten: string;
  status: boolean;
}

export interface ExtensionStatusData {
  exten: string;
  type: ForwardRuleType;
  number: string;
  dateFrom: string;
  dateTo: string;
  status: boolean;
  change?: boolean;
}

export interface GetExtensionForwardStatus {
  isForwardEnable: boolean;
  forwardType?: ForwardRuleType;
  exten?: string;
}
