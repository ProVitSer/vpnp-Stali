import { DialExtensionDto } from '../dto/dial-extension.dto';
import { ExtensionCallDto } from '../dto/extension-call.dto';
import { GroupCallDto } from '../dto/group-call.dto';
import { OffHoursDto } from '../dto/off-hours.dto';
import { AsteriskActionType } from './asteriks-api.enum';

export type CallInfo = OffHoursDto | DialExtensionDto | GroupCallDto | ExtensionCallDto;

export type AsteriskApiProviders = {
  [key in AsteriskActionType]: AsteriskApiProviderInterface;
};

export interface AsteriskApiProviderInterface {
  sendAggregateCallInfo(data: CallInfo): Promise<void>;
}
