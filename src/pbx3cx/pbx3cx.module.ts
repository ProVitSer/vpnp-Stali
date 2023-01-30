import { LoggerModule } from '@app/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pbx3cxService } from './pbx3cx.service';
import { ClParticipants, ClPartyInfo, ClSegments, ClCalls, CallcentQueuecalls, Meetingsession } from './entities';
import { Pbx3cxCallInfoService } from './pbx3cx-call-info.service';

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
    TypeOrmModule.forFeature([ClParticipants, ClPartyInfo, ClSegments, ClCalls, CallcentQueuecalls, Meetingsession]),
  ],
  providers: [Pbx3cxCallInfoService, Pbx3cxService],
  exports: [Pbx3cxCallInfoService, Pbx3cxService],
})
export class Pbx3cxModule {}
