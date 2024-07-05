import { ActionType } from '@app/selenoid/interfaces/selenoid.enum';
import { ExtensionForwardDto } from '../dto/extension-forward.dto';
import { MailForwardDto } from '../dto/mail-forward.dto';
import { QueueStatusDto } from '../dto/queue-status.dto';
import { ExtensionForwardRuleType, ForwardStatus, FwType, QueueStatus, ServicesType } from './additional-services.enum';
import { Observable } from 'rxjs';

export const ServicesTypeToActionTypeMap: { [key in ServicesType]?: ActionType } = {
    [ServicesType.mail]: ActionType.mailForward
};

export type ChangeTypes = QueueStatusDto | ExtensionForwardDto | MailForwardDto;

export interface ExtensionForwardStatus {
    isForwardEnable: boolean;
    forwardType?: ExtensionForwardRuleType;
    exten?: string;
}

export interface GetExtensionForward {
    extension: number;
    mobile: string;
    outsideNumber: string;
    forwardToDn: number | null;
}

export interface ExtensionsPbx {
    GetExtensionStatus(data: GetExtensionStatusRequest): Observable<ExtensionStatus>;
    SetExtensionForwardStatus(data: SetExtensionForwardStatusRequest): Observable<ExtensionStatus>;
    SetExtensionGlobalQueuesStatus(data: SetExtensionGlobalQueuesStatusRequest): Observable<ExtensionStatus>;
    SetExtensionCallForwardStatus(data: SetExtensionCallForwardStatusRequest): Observable<ExtensionStatus>;
}

export interface GetExtensionStatusRequest {
    extension: string;
}

export interface SetExtensionForwardStatusRequest {
    extension: string, 
    status: ForwardStatus
}

export interface SetExtensionGlobalQueuesStatusRequest {
    extension: string, 
    status: QueueStatus
}



export interface ExtensionStatus {
    extension: string;
    registered: boolean;
    forwardingRulesStatus: string;
    queuesStatus: string;
    groups: string[];
    inRingGroups: string[];
    loggedInQueues: string[];
}

export interface SetExtensionCallForwardStatusRequest{
    extension: string;
    fwStatus: ForwardStatus;
    callType: string;
    fwType: FwType;
    number: string;
}

export interface ExtensionForwardData {
    exten: string;
    type: ExtensionForwardRuleType;
    number: string;
    dateFrom: string;
    dateTo: string;
    status: boolean;
}