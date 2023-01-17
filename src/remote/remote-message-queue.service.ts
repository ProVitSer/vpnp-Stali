import { Injectable } from '@nestjs/common';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RemoteProviderData } from './interfaces/remote-interface';
import { RemoteProvider } from './remote.provider';
import { LoggerService } from '@app/logger/logger.service';
import { UtilsService } from '@app/utils/utils.service';

@Injectable()
export class RemoteMessageQueueService {
  static MQ_ROUTINGKEY = 'remote';
  static MQ_NAME = 'presence';
  static EXCHANGE = 'presence';
  private serviceContext: string;
  constructor(private readonly remoteProvider: RemoteProvider, private connection: AmqpConnection, private readonly logger: LoggerService) {
    this.serviceContext = RemoteMessageQueueService.name;
  }

  public async publish(message: any): Promise<void> {
    return this.connection.publish(RemoteMessageQueueService.EXCHANGE, RemoteMessageQueueService.MQ_ROUTINGKEY, message);
  }

  @RabbitSubscribe({
    exchange: RemoteMessageQueueService.EXCHANGE,
    queue: RemoteMessageQueueService.MQ_NAME,
    routingKey: RemoteMessageQueueService.MQ_ROUTINGKEY,
  })
  public async subForRemote(message: RemoteProviderData): Promise<void> {
    try {
      await UtilsService.timeout(10000);
      console.log(message);
      return await this.remoteProvider.action(message);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      return;
    }
  }
  private static errorHandler(channel: any, msg: any, error: any): void {
    console.log('errorHandler', error);
  }
}
