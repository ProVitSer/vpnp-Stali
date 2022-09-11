import { LoggerModule } from '@app/logger/logger.module';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActiveDirectoryController } from './active-directory.controller';
import { ActiveDirectoryService } from './active-directory.service';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports:[ConfigModule, LoggerModule, 
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true
      }),
    })],
  controllers: [ActiveDirectoryController],
  providers: [ActiveDirectoryService]
})
export class ActiveDirectoryModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
        .apply(LoggerMiddleware)
        .forRoutes(ActiveDirectoryController);
  }
}
