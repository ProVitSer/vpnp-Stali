import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdditionalServicesModelService, AdditionalServicesService } from './additional-services.service';
import { AdditionalServicesController } from './additional-services.controller';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { LoggerModule } from '@app/logger/logger.module';
import { SelenoidModule } from '@app/selenoid/selenoid.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypegooseModule } from 'nestjs-typegoose';
import { AdditionalServicesModel } from './additional-services..model';
import { ChangeForwardScheduleService } from './schedule/change-forward.schedule';
import { Pbx3cxModule } from '@app/pbx3cx/pbx3cx.module';

@Module({
  imports: [
    LoggerModule,
    SelenoidModule,
    ScheduleModule.forRoot(),
    TypegooseModule.forFeature([
      {
        typegooseClass: AdditionalServicesModel,
        schemaOptions: {
          collection: 'additionalServices',
        },
      },
    ]),
    Pbx3cxModule,
  ],
  providers: [AdditionalServicesService, AdditionalServicesModelService, ChangeForwardScheduleService],
  controllers: [AdditionalServicesController],
})
export class AdditionalServicesModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AdditionalServicesController);
  }
}
