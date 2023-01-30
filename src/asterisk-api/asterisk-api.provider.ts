import { Injectable } from '@nestjs/common';
import { AsteriskActionType } from './interfaces/asteriks-api.enum';
import { AsteriskApiProviderInterface, AsteriskApiProviders, CallInfo } from './interfaces/asteriks-api.interface';
import { GroupCall, NotWorkTime, ExtensionCall, DialExtension } from './providers';

@Injectable()
export class AsteriskApiProvider {
  constructor(
    private readonly groupCall: GroupCall,
    private readonly notWorkCall: NotWorkTime,
    private readonly extensionCall: ExtensionCall,
    private readonly dialExtension: DialExtension,
  ) {}

  private get providers(): AsteriskApiProviders {
    return {
      [AsteriskActionType.GroupCallInfo]: this.groupCall,
      [AsteriskActionType.NotWorkTimeCallInfo]: this.notWorkCall,
      [AsteriskActionType.ExtensionCallInfo]: this.extensionCall,
      [AsteriskActionType.DialExtensionCallInfo]: this.dialExtension,
    };
  }

  public async sendCallInfo(callInfo: CallInfo, actionType: AsteriskActionType) {
    const provider = this.getProvider(actionType);
    return provider.aggregateCallInfo(callInfo);
  }

  private getProvider(actionType: AsteriskActionType): AsteriskApiProviderInterface {
    return this.providers[actionType];
  }
}
