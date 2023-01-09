import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { AsteriskModule } from '@app/asterisk/asterisk.module';
import { DockerModule } from '@app/docker/docker.module';
import { DockerImgServiceHealthIndicator, DockerServiceHealthIndicator } from './health-indicator/docker.healthIndicator';
import { HttpModule } from '@nestjs/axios';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { LoggerModule } from '@app/logger/logger.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthScheduledService } from './schedule/health-service.schedule';
import { MailModule } from '@app/mail/mail.module';
import { TypegooseHealthIndicator } from './health-indicator/typegoose.healthIndicator';
import { AsteriskHealthIndicator } from './health-indicator/asterisk.healthIndicator';

@Module({
  imports: [
    TerminusModule,
    ConfigModule,
    LoggerModule,
    DockerModule,
    AsteriskModule,
    MailModule,
    ScheduleModule.forRoot(),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true,
      }),
    }),
  ],
  controllers: [HealthController],
  providers: [
    HealthService,
    DockerImgServiceHealthIndicator,
    DockerServiceHealthIndicator,
    TypegooseHealthIndicator,
    HealthScheduledService,
    AsteriskHealthIndicator,
  ],
  exports: [HealthService],
})
export class HealthModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(HealthController);
  }
}
