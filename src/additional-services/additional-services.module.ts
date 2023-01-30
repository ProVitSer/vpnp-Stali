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
  ],
  providers: [AdditionalServicesService, AdditionalServicesModelService, ChangeForwardScheduleService],
  controllers: [AdditionalServicesController],
})
export class AdditionalServicesModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes(AdditionalServicesController);
  }
}
