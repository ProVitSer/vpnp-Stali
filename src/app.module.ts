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

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule.forRoot({ load: [configuration] }),  LoggerModule, Soap1cModule, XmlModule],
  // exports: []
})
export class AppModule {}
