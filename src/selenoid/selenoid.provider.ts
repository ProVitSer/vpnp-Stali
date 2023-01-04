import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { EsetSetRemoteAccess, ExtensionForward, MailForward, QueueStatus, EsetGetRemoteAccessStatus } from './providers/index';
import { SelenoidDataTypes, SelenoidProviderInterface } from './interfaces/interface';
import { ActionType } from './interfaces/types';

@Injectable()
export class SelenoidProvider {
  private serviceContext: string;
  constructor(
    private readonly logger: LoggerService,
    private readonly queueStatus: QueueStatus,
    private readonly extensionForward: ExtensionForward,
    private readonly mailForward: MailForward,
    private readonly esetSetRemoteAccess: EsetSetRemoteAccess,
    private readonly esetGetRemoteAccessStatus: EsetGetRemoteAccessStatus,
  ) {
    this.serviceContext = SelenoidProvider.name;
  }

  get providers(): any {
    return {
      [ActionType.mailForward]: this.mailForward,
      [ActionType.extensionForward]: this.extensionForward,
      [ActionType.queueStatus]: this.queueStatus,
      [ActionType.esetSetRemoteAccess]: this.esetSetRemoteAccess,
      [ActionType.esetCheckRemoteAccess]: this.esetGetRemoteAccessStatus,
    };
  }

  public async change(action: ActionType, data: SelenoidDataTypes) {
    try {
      const provider = this.getProvider(action);
      return await provider.selenoidChange(data);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }

  private getProvider(action: ActionType): SelenoidProviderInterface {
    return this.providers[action];
  }
}
