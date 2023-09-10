import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import {
  EsetSetRemoteAccess,
  ExtensionForward,
  MailForward,
  QueueStatus,
  EsetGetRemoteAccessStatus,
  MailCheckForward,
} from './providers/index';
import { SelenoidDataResult, SelenoidDataTypes, SelenoidProviderInterface, SelenoidProviders } from './interfaces/selenoid.interface';
import { ActionType } from './interfaces/selenoid.enum';

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
    private readonly mailCheckForward: MailCheckForward,
  ) {
    this.serviceContext = SelenoidProvider.name;
  }

  private get providers(): SelenoidProviders {
    return {
      [ActionType.mailForward]: this.mailForward,
      [ActionType.extensionForward]: this.extensionForward,
      [ActionType.queueStatus]: this.queueStatus,
      [ActionType.esetSetRemoteAccess]: this.esetSetRemoteAccess,
      [ActionType.esetCheckRemoteAccess]: this.esetGetRemoteAccessStatus,
      [ActionType.mailCheckForward]: this.mailCheckForward,
    };
  }

  public async action(action: ActionType, data: SelenoidDataTypes): Promise<SelenoidDataResult> {
    try {
      const provider = this.getProvider(action);
      return await provider.selenoidAction(data);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }

  private getProvider(action: ActionType): SelenoidProviderInterface {
    return this.providers[action];
  }
}
