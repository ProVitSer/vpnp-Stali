import { Injectable } from '@nestjs/common';
import { SmartRoutingActionType } from './interfaces/smart-routing-api.enum';
import { SmartRoutingApiProviderInterface, SmartRoutingApiProviders, CallInfo } from './interfaces/smart-routing-api.interface';
import { GroupCall, NotWorkTime, ExtensionCall, DialExtension } from './providers';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class SmartRoutingApiProvider {
  private serviceContext: string;
  constructor(
    private readonly groupCall: GroupCall,
    private readonly notWorkCall: NotWorkTime,
    private readonly extensionCall: ExtensionCall,
    private readonly dialExtension: DialExtension,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = SmartRoutingApiProvider.name;
  }

  private get providers(): SmartRoutingApiProviders {
    return {
      [SmartRoutingActionType.GroupCallInfo]: this.groupCall,
      [SmartRoutingActionType.NotWorkTimeCallInfo]: this.notWorkCall,
      [SmartRoutingActionType.ExtensionCallInfo]: this.extensionCall,
      [SmartRoutingActionType.DialExtensionCallInfo]: this.dialExtension,
    };
  }

  public async sendCallInfo(callInfo: CallInfo, actionType: SmartRoutingActionType): Promise<void> {
    try {
      const provider = this.getProvider(actionType);
      return provider.sendAggregateCallInfo(callInfo);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  private getProvider(actionType: SmartRoutingActionType): SmartRoutingApiProviderInterface {
    return this.providers[actionType];
  }
}
