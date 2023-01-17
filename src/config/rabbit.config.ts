import { RemoteMessageQueueService } from '@app/remote/remote-message-queue.service';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

export const getRabbitMQConfig = async (configService: ConfigService): Promise<RabbitMQConfig> => {
  return {
    exchanges: [
      {
        name: RemoteMessageQueueService.EXCHANGE,
        type: 'topic',
      },
    ],
    uri: configService.get<string>('rabbitMqUrl'),
    //connectionInitOptions: { wait: false },
    prefetchCount: 1,
  };
};
