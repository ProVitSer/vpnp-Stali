import { LoggerModule } from '@app/logger/logger.module';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { Soap1cModule } from '@app/soap1c/soap1c.module';
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmartRoutingApiController } from './smart-routing-api.controller';
import { SmartRoutingApiProvider } from './smart-routing-api.provider';
import { GroupCall, NotWorkTime, ExtensionCall, DialExtension } from './providers';
import { Pbx3cxModule } from '@app/pbx3cx/pbx3cx.module';

@Module({
  imports: [ConfigModule, LoggerModule, Soap1cModule, Pbx3cxModule],
  controllers: [SmartRoutingApiController],
  providers: [SmartRoutingApiProvider, GroupCall, NotWorkTime, ExtensionCall, DialExtension],
})
export class SmartRoutingApiModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(SmartRoutingApiController);
  }
}
