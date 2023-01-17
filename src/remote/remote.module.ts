import { ActiveDirectoryModule } from '@app/active-directory/active-directory.module';
import { LoggerModule } from '@app/logger/logger.module';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { SelenoidModule } from '@app/selenoid/selenoid.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { RemoteModel } from './remote.model';
import { RemoteController } from './remote.controller';
import { RemoteModelService, RemoteService } from './remote.service';
import { SetRemoteAccessScheduleService } from './schedule/set-remote-access.schedule';
import { ScheduleModule } from '@nestjs/schedule';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RemoteMessageQueueService } from './remote-message-queue.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getRabbitMQConfig } from '@app/config/rabbit.config';
import { RemoteProvider } from './remote.provider';
import { ActivateRemote, AdUsersListRemote, DeactivateRemote, GetUserStatusRemote } from './providers';
import { MAX_REMOTE_DURATION, MAX_REMOTE_POINTS } from '@app/config/app.config';
import { RATELIMIT_REQUEST_ERROR } from './remote.constants';

@Module({
  imports: [
    LoggerModule,
    SelenoidModule,
    ActiveDirectoryModule,
    RateLimiterModule.register({
      duration: MAX_REMOTE_DURATION,
      points: MAX_REMOTE_POINTS,
      errorMessage: RATELIMIT_REQUEST_ERROR,
    }),
    TypegooseModule.forFeature([
      {
        typegooseClass: RemoteModel,
        schemaOptions: {
          collection: 'remote',
        },
      },
    ]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: getRabbitMQConfig,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    RemoteService,
    RemoteModelService,
    RemoteMessageQueueService,
    RemoteProvider,
    ActivateRemote,
    DeactivateRemote,
    GetUserStatusRemote,
    AdUsersListRemote,
    SetRemoteAccessScheduleService,
  ],
  exports: [RemoteService],
  controllers: [RemoteController],
})
export class RemoteModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(RemoteController);
  }
}
