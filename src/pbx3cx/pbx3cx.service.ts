import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { ActionType } from '@app/selenoid/interfaces/types';
import { Injectable } from '@nestjs/common';
import { ForwardDto } from './dto/forward.dto';
import { QueueDto } from './dto/queue.dto';

@Injectable()
export class Pbx3cxService {
  constructor(private readonly selenoid: SelenoidProvider) {}

  public async changeQueueStatus(data: QueueDto) {
    await this.selenoid.change(ActionType.queueStatus, data);
  }

  public async changeExtensionForward(data: ForwardDto) {
    await this.selenoid.change(ActionType.extensionForward, data);
  }
}
