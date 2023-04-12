import { EsetGetRemoteAccessStatusData, EsetSetRemoteAccessData } from '../providers/eset/eset.interfaces';
import { MailForwardData } from '../providers/mail/mail.interfaces';
import { ExtensionStatusData, QueueStatusData } from '../providers/pbx3cx/pbx3cx.interfaces';
import { ActionType } from './selenoid.enum';

export interface Capabilities {
  browserName: string;
  version: string;
  name: string;
  platform: string;
}

export type SelenoidDataTypes =
  | QueueStatusData
  | ExtensionStatusData
  | MailForwardData
  | EsetSetRemoteAccessData
  | EsetGetRemoteAccessStatusData;

export type SelenoidProviders = {
  [key in ActionType]: SelenoidProviderInterface;
};

export interface SelenoidProviderInterface {
  selenoidAction(data: SelenoidDataTypes): Promise<void | boolean>;
}
