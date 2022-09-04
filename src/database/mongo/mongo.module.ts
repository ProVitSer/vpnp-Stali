import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import schemas from './mongo.provider';
import { MailService } from './services/mail.service';
import { MongoService } from './mongo.service';

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
  exports: [MailService],
  providers: [MongoService, MailService],
})
export class MongoModule {}