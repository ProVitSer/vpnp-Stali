import { Injectable } from '@nestjs/common';
import { AsteriskActionType } from './interfaces/aasteriks-api.enum';
import { GroupCall, NotWorkTime, ExtensionCall, DialExtension } from './providers';

@Injectable()
export class AsteriskProvider {
  constructor(
    private readonly groupCall: GroupCall,
    private readonly notWorkCall: NotWorkTime,
    private readonly extensionCall: ExtensionCall,
    private readonly mail: DialExtension,
  ) {}

  get providers(): any {
    return {
      [AsteriskActionType.GroupCallInfo]: this.groupCall,
      [AsteriskActionType.NotWorkTimeInfo]: this.notWorkCall,
      [AsteriskActionType.ExtensionCallInfo]: this.extensionCall,
      [AsteriskActionType.DialExtensionInfo]: this.mail,
    };
  }

  public async sendCallInfo(callInfo: any) {
    return;
  }

  private getProvider(route: any): any {
    return this.providers[route];
  }
}
