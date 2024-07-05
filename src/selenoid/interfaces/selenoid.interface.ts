import { EsetGetRemoteAccessStatusData, EsetSetRemoteAccessData } from '../providers/eset/eset.interfaces';
import { MailCheckForwardData, MailCheckForwardResult, MailForwardData } from '../providers/mail/mail.interfaces';
import { ActionType } from './selenoid.enum';

export interface Capabilities {
    browserName: string;
    version: string;
    name: string;
    platform: string;
}

export type SelenoidDataTypes =
    MailForwardData
    | EsetSetRemoteAccessData
    | EsetGetRemoteAccessStatusData
    | MailCheckForwardData;

export type SelenoidProviders = {
    [key in ActionType]: SelenoidProviderInterface;
};

export interface SelenoidProviderInterface {
    selenoidAction(data: SelenoidDataTypes): Promise<SelenoidDataResult>;
}

export type SelenoidDataResult = MailCheckForwardResult | void | boolean;
