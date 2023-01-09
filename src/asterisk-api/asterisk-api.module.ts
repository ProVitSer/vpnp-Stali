import { LoggerModule } from '@app/logger/logger.module';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AsteriskApiController } from './asterisk-api.controller';
import { AsteriskApiProvider } from './asterisk-api.provider';
import { GroupCall, NotWorkTime, ExtensionCall, DialExtension } from './providers';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [AsteriskApiController],
  providers: [AsteriskApiProvider, GroupCall, NotWorkTime, ExtensionCall, DialExtension],
})
export class AsteriskApiModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AsteriskApiController);
  }
}
