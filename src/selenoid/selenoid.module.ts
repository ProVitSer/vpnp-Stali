import { MongoModule } from '@app/database/mongo/mongo.module';
import { DockerModule } from '@app/docker/docker.module';
import { LoggerModule } from '@app/logger/logger.module';
import { LoggerMiddleware } from '@app/middlewares/logger.middleware';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Login, Logout, QueueStatus, GetExtension, ExtensionForward, MailForward} from './providers';
import { SelenoidController } from './selenoid.controller';
import { SelenoidProvider } from './selenoid.provider';
import { SelenoidWebdriver } from './selenoid.webdriver';

@Module({
  imports: [ConfigModule, LoggerModule, DockerModule, MongoModule],
  providers: [SelenoidProvider, SelenoidWebdriver, Login, Logout, QueueStatus, GetExtension, ExtensionForward, MailForward],
  controllers: [SelenoidController],
  exports: [SelenoidProvider]
})
export class SelenoidModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
        .apply(LoggerMiddleware)
        .forRoutes(SelenoidController);
  }
}
