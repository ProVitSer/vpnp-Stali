import { EsetStatus, ExtensionForwardRuleType } from './types';

export interface Capabilities {
  browserName: string;
  version: string;
  name: string;
  platform: string;
}

export interface QueueStatusData {
  exten: string;
  status: boolean;
}

export interface ExtensionStatusData {
  exten: string;
  type: ExtensionForwardRuleType;
  number: string;
  dateFrom: string;
  dateTo: string;
  status: boolean;
  change?: boolean;
}

export interface MailForwardData {
  from: string;
  to: string;
  dateFrom: string;
  dateTo: string;
  status: boolean;
  change?: boolean;
}

export interface EsetData {
  userName: string;
  phoneNumber: string;
  status: EsetStatus;
}

export type SelenoidDataTypes = QueueStatusData | ExtensionStatusData | MailForwardData | EsetData;

export interface SelenoidProviderInterface {
  selenoidChange(data: SelenoidDataTypes): Promise<any>;
}
