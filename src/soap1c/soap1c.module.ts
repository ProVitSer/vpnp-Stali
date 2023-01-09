import { LoggerModule } from '@app/logger/logger.module';
import { XmlModule } from '@app/xml/xml.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReturnNumber } from './providers/return-number';
import { SetID } from './providers/set-id';
import { Soap1cProvider } from './sopa1c.provider';
import { HttpModule } from '@nestjs/axios';
import { SetNumber } from './providers/set-number';

@Module({
  imports: [
    XmlModule,
    ConfigModule,
    LoggerModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        headers: {
          'User-Agent': 'StaliRRC/2.0.2',
          Content: 'application/json',
          'Content-Type': 'application/soap+xml;charset=utf-8',
          //'Authorization':"Basic " + Buffer.from(`${configService.get('server1C.username')}:${configService.get('server1C.secret')}`).toString("base64")
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [Soap1cProvider, ReturnNumber, SetID, SetNumber],
  exports: [Soap1cProvider],
})
export class Soap1cModule {}
