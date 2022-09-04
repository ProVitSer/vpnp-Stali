import * as Docker from 'dockerode';
import { DockerService } from './docker.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/logger/logger.module';

const providers = [
  DockerService,
  {
    provide: 'DOCKER_SERVICE',
    useFactory: (configService: ConfigService) => {
        return new Docker();
    },
    inject: [ConfigService]
  },
  
];

@Module({
  providers,
  imports:[ConfigModule, LoggerModule],
  exports: [...providers],
})

export class DockerModule {}

