import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@app/config/config.provides';
import { LoggerModule } from './logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmModule } from './database/orm/orm.module';
import { AsteriskModule } from './asterisk/asterisk.module';
import { Soap1cModule } from './soap1c/soap1c.module';
import { XmlModule } from './xml/xml.module';
import { SelenoidModule } from './selenoid/selenoid.module';
import { DockerModule } from './docker/docker.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ActiveDirectoryModule } from './active-directory/active-directory.module';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { Pbx3cxModule } from './pbx3cx/pbx3cx.module';
import { ServiceModule } from './service/service.module';
import { AdvancedModule } from './advanced/advanced.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    LoggerModule,
    AsteriskModule,
    Soap1cModule,
    XmlModule,
    OrmModule,
    SelenoidModule,
    DockerModule,
    ScheduleModule,
    ActiveDirectoryModule,
    HealthModule,
    MailModule,
    Pbx3cxModule,
    ServiceModule,
    AdvancedModule,
  ],
})
export class AppModule {}
