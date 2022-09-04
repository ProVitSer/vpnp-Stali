import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import schemas from './mongo.provider';
import { MailService } from './services/mail.service';
import { MongoService } from './mongo.service';
import { ForwardService } from './services/forward.service';
import { Change } from './services/change';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('database.mongo.mongodbUri'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([...schemas()]),
  ],
  exports: [MailService, ForwardService, Change],
  providers: [MongoService, MailService, ForwardService, Change],
})
export class MongoModule {}