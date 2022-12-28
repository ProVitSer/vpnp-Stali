import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { SelenoidModule } from '@app/selenoid/selenoid.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { Pbx3cxController } from './pbx3cx.controller';
import { Pbx3cxService } from './pbx3cx.service';

@Module({
  imports: [SelenoidModule],
  controllers: [Pbx3cxController],
  providers: [Pbx3cxService],
})
export class Pbx3cxModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(Pbx3cxController);
  }
}
