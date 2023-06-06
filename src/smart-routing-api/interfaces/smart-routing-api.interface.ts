import { DialExtensionDto } from '../dto/dial-extension.dto';
import { ExtensionCallDto } from '../dto/extension-call.dto';
import { GroupCallDto } from '../dto/group-call.dto';
import { OffHoursDto } from '../dto/off-hours.dto';
import { SmartRoutingActionType } from './smart-routing-api.enum';

export type CallInfo = OffHoursDto | DialExtensionDto | GroupCallDto | ExtensionCallDto;

export type SmartRoutingApiProviders = {
  [key in SmartRoutingActionType]: SmartRoutingApiProviderInterface;
};

export interface SmartRoutingApiProviderInterface {
  sendAggregateCallInfo(data: CallInfo): Promise<void>;
}
