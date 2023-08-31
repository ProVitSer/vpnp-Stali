import { LoggerModule } from '@app/logger/logger.module';
import { XmlModule } from '@app/xml/xml.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Soap1cProvider } from './sopa1c.provider';
import { HttpModule } from '@nestjs/axios';
import { Soap1CConfigService } from './services/soap-1c-config.service';
import { GetRouteNumber, SetID, SetNumber } from './providers';

@Module({
  imports: [
    XmlModule,
    ConfigModule,
    LoggerModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        headers: {
          'User-Agent': 'StaliRRC/2.0.2',
          Content: 'application/json',
          'Content-Type': 'application/soap+xml;charset=utf-8',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [Soap1cProvider, GetRouteNumber, SetID, SetNumber, Soap1CConfigService],
  exports: [Soap1cProvider],
})
export class Soap1cModule {}
