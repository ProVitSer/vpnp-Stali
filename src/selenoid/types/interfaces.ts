import { ChangeExtensionForward, ChangeMailForward, ExtensionForwardRuleType } from "./types";

export interface Capabilities {
    browserName: string;
    version: string;
    name: string;
    platform: string;
}

export interface QueueStatusData {
    exten: string;
    status: string;
}

export interface ExtensionStatusData {
    exten: string;
    type: ExtensionForwardRuleType;
    number: string;
    dateFrom: string;
    dateTo: string;
    status: ChangeExtensionForward;
    change?: boolean;
}

export interface MailForwardData {
    from: string;
    to: string;
    dateFrom: string;
    dateTo: string;
    status: ChangeMailForward;
    change?: boolean;
}

export type SelenoidDataTypes = QueueStatusData | ExtensionStatusData | MailForwardData


export interface SelenoidProviderInterface {
    selenoidChange(data: SelenoidDataTypes): Promise<any>;
}