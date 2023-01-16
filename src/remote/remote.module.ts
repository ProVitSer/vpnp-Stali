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
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  controllers: [RemoteController],
  imports: [
    LoggerModule,
    SelenoidModule,
    ActiveDirectoryModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: RemoteModel,
        schemaOptions: {
          collection: 'remote',
        },
      },
    ]),
    ScheduleModule.forRoot(),
    RateLimiterModule,
  ],
  providers: [
    RemoteService,
    RemoteModelService,
    SetRemoteAccessScheduleService,
    {
      provide: 'APP_GUARD',
      useClass: RateLimiterGuard,
    },
  ],
})
export class RemoteModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(RemoteController);
  }
}
