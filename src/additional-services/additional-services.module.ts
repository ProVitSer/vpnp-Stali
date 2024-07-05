import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdditionalServicesService } from './additional-services.service';
import { AdditionalServicesController } from './additional-services.controller';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { LoggerModule } from '@app/logger/logger.module';
import { SelenoidModule } from '@app/selenoid/selenoid.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypegooseModule } from 'nestjs-typegoose';
import { AdditionalServicesModel } from './additional-services.model';
import { ChangeForwardScheduleService } from './schedule/change-forward.schedule';
import { Pbx3cxModule } from '@app/pbx3cx/pbx3cx.module';
import { AdditionalModelService, ExtensionForwardService } from './services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

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
        ClientsModule.register([
            {
              name: 'EXTENSION',
              transport: Transport.GRPC,
              options: {
                url: '127.0.0.1:2838',
                package: 'extension',
                protoPath: join(__dirname, '../../proto/extension.proto'),

              },
            },
          ]),
    ],
    providers: [AdditionalServicesService, AdditionalModelService, ChangeForwardScheduleService, ExtensionForwardService],

    controllers: [AdditionalServicesController],
})
export class AdditionalServicesModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes(AdditionalServicesController);
    }
}

