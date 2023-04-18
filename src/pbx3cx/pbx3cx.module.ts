import { LoggerModule } from '@app/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pbx3cxService } from './pbx3cx.service';
import {
  ClParticipants,
  ClPartyInfo,
  ClSegments,
  ClCalls,
  CallcentQueuecalls,
  Meetingsession,
  Extension,
  Dn,
  Fwdprofile,
} from './entities';
import { Pbx3cxCallInfoService } from './pbx3cx-call-info.service';
import { Pbx3cxForwardStatusService } from './pbx3cx-forward-status.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        name: 'postgres',
        type: 'postgres',
        host: config.get('database.pg.host'),
        port: config.get('database.pg.port'),
        username: config.get('database.pg.username'),
        password: config.get('database.pg.password'),
        database: config.get('database.pg.database'),
        entities: [__dirname + '/entities/*{.ts,.js}'],
        synchronize: false,
        useUnifiedTopology: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      ClParticipants,
      ClPartyInfo,
      ClSegments,
      ClCalls,
      CallcentQueuecalls,
      Meetingsession,
      Dn,
      Extension,
      Fwdprofile,
    ]),
  ],
  providers: [Pbx3cxCallInfoService, Pbx3cxService, Pbx3cxForwardStatusService],
  exports: [Pbx3cxService, Pbx3cxForwardStatusService],
})
export class Pbx3cxModule {}
