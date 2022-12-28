import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdvancedService } from './advanced.service';
import { AdvancedController } from './advanced.controller';
import { SelenoidModule } from '@app/selenoid/selenoid.module';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';

@Module({
  imports: [SelenoidModule],
  providers: [AdvancedService],
  controllers: [AdvancedController],
})
export class AdvancedModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AdvancedController);
  }
}
