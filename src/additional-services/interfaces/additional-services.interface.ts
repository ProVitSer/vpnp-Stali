import { ActionType } from '@app/selenoid/interfaces/selenoid-types';
import { ExtensionForwardDto } from '../dto/extension-forward.dto';
import { MailForwardDto } from '../dto/mail-forward.dto';
import { QueueStatusDto } from '../dto/queue-status.dto';
import { ServicesType } from './additional-services.enum';

export const ServicesTypeToActionTypeMap: { [key in ServicesType]?: ActionType } = {
  [ServicesType.mail]: ActionType.mailForward,
  [ServicesType.queue]: ActionType.queueStatus,
  [ServicesType.extension]: ActionType.extensionForward,
};

export type ChangeTypes = QueueStatusDto | ExtensionForwardDto | MailForwardDto;
