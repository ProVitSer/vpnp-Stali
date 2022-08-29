import { LoggerModule } from '@app/logger/logger.module';
import { Soap1cModule } from '@app/soap1c/soap1c.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as ARI from 'ari-client';
import { DialplanApplicationService } from './ari/dialplan.service';

@Module({
    imports: [
        ConfigModule,
        LoggerModule,
        Soap1cModule
    ],
    providers: [
        {
            provide: 'ARI',
            useFactory: async (configService: ConfigService) => {
                return {
                    ariClient: await ARI.connect(
                        configService.get('asterisk.ari.url'), 
                        configService.get('asterisk.ari.user'), 
                        configService.get('asterisk.ari.password')),
                };
            },
            inject: [ConfigService]
        },
        DialplanApplicationService
  
    ],
    exports: ['ARI', DialplanApplicationService]
})
export class AsteriskModule {}
