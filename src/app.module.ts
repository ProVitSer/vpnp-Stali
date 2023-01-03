import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AdvancedModule } from './advanced/advanced.module';
import { RemoteModule } from './remote/remote.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './config/mongo.config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    LoggerModule,
    AsteriskModule,
    Soap1cModule,
    SelenoidModule,
    XmlModule,
    OrmModule,
    DockerModule,
    ActiveDirectoryModule,
    HealthModule,
    MailModule,
    Pbx3cxModule,
    AdvancedModule,
    RemoteModule,
  ],
})
export class AppModule {}
