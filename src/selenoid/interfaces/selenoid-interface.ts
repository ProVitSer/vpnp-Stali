import { EsetStatus } from './selenoid-types';

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
  type: ForwardRuleType;
  number: string;
  dateFrom: string;
  dateTo: string;
  status: boolean;
  change?: boolean;
}

export enum ForwardRuleType {
  mobile = 'mobile',
  extension = 'extension',
  external = 'external',
}

export interface MailForwardData {
  from: string;
  to: string;
  dateFrom: string;
  dateTo: string;
  status: boolean;
  change?: boolean;
}

export interface EsetSetRemoteAccessData {
  userName: string;
  phoneNumber?: string;
  status: EsetStatus;
}

export interface EsetGetRemoteAccessStatusData {
  userName: string;
}

export type SelenoidDataTypes =
  | QueueStatusData
  | ExtensionStatusData
  | MailForwardData
  | EsetSetRemoteAccessData
  | EsetGetRemoteAccessStatusData;

export interface SelenoidProviderInterface {
  selenoidChange(data: SelenoidDataTypes): Promise<any>;
}
