import { LoggerModule } from '@app/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CallInfoService } from './call-info.service';
import { CallService } from './call.service';
import { ClParticipants, ClPartyInfo, ClSegments, ClCalls, CallcentQueuecalls, Meetingsession } from './entities';

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
  providers: [CallInfoService, CallService],
  exports: [CallInfoService, CallService],
})
export class OrmModule {}
