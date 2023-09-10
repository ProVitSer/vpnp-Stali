import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '@app/config/config.provides';
import { LoggerModule } from './logger/logger.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AsteriskModule } from './asterisk/asterisk.module';
import { Soap1cModule } from './soap1c/soap1c.module';
import { XmlModule } from './xml/xml.module';
import { SelenoidModule } from './selenoid/selenoid.module';
import { DockerModule } from './docker/docker.module';
import { ActiveDirectoryModule } from './active-directory/active-directory.module';
import { MailModule } from './mail/mail.module';
import { RemoteModule } from './remote/remote.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './config/mongo.config';
import { AdditionalServicesModule } from './additional-services/additional-services.module';
import { Pbx3cxModule } from './pbx3cx/pbx3cx.module';
import { SmartRoutingApiModule } from './smart-routing-api/smart-routing-api.module';

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
    DockerModule,
    ActiveDirectoryModule,
    //HealthModule,
    MailModule,
    RemoteModule,
    AdditionalServicesModule,
    Pbx3cxModule,
    SmartRoutingApiModule,
  ],
})
export class AppModule {}
