import { Module } from '@nestjs/common';
import { ScheduleModule as Schedule } from '@nestjs/schedule';
import { LoggerModule } from '@app/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { SelenoidModule } from '@app/selenoid/selenoid.module';
import { MongoModule } from '@app/database/mongo/mongo.module';
import { ChangeForwardScheduleService } from './schedules/changeForward.schedule';
import { HealthScheduledService } from './schedules/healthServiceScheduled';
import { HealthModule } from '@app/health/health.module';
import { MailModule } from '@app/mail/mail.module';

@Module({
  imports: [Schedule.forRoot(), LoggerModule, ConfigModule, SelenoidModule, MongoModule, HealthModule, MailModule],
  providers: [ChangeForwardScheduleService, HealthScheduledService],
})
export class ScheduleModule {}
