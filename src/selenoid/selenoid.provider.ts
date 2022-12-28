import { LoggerService } from '@app/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Eset, ExtensionForward, MailForward, QueueStatus } from './providers/index';
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
    private readonly eset: Eset,
  ) {
    this.serviceContext = SelenoidProvider.name;
  }

  get providers(): any {
    return {
      [ActionType.mailForward]: this.mailForward,
      [ActionType.extensionForward]: this.extensionForward,
      [ActionType.queueStatus]: this.queueStatus,
      [ActionType.eset]: this.eset,
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
