import { Injectable } from '@nestjs/common';
import { AsteriskActionType } from './interfaces/asteriks-api.enum';
import { AsteriskApiProviderInterface, AsteriskApiProviders, CallInfo } from './interfaces/asteriks-api.interface';
import { GroupCall, NotWorkTime, ExtensionCall, DialExtension } from './providers';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class AsteriskApiProvider {
  private serviceContext: string;
  constructor(
    private readonly groupCall: GroupCall,
    private readonly notWorkCall: NotWorkTime,
    private readonly extensionCall: ExtensionCall,
    private readonly dialExtension: DialExtension,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = AsteriskApiProvider.name;
  }

  private get providers(): AsteriskApiProviders {
    return {
      [AsteriskActionType.GroupCallInfo]: this.groupCall,
      [AsteriskActionType.NotWorkTimeCallInfo]: this.notWorkCall,
      [AsteriskActionType.ExtensionCallInfo]: this.extensionCall,
      [AsteriskActionType.DialExtensionCallInfo]: this.dialExtension,
    };
  }

  public async sendCallInfo(callInfo: CallInfo, actionType: AsteriskActionType): Promise<void> {
    try {
      const provider = this.getProvider(actionType);
      return provider.sendAggregateCallInfo(callInfo);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private getProvider(actionType: AsteriskActionType): AsteriskApiProviderInterface {
    return this.providers[actionType];
  }
}
