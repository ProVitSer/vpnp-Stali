import { MongoModule } from '@app/database/mongo/mongo.module';
import { DockerModule } from '@app/docker/docker.module';
import { LoggerModule } from '@app/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Login, Logout, QueueStatus, GetExtension, ExtensionForward, MailForward, EsetLogin, EsetLogout, Eset } from './providers';
import { SelenoidProvider } from './selenoid.provider';
import { SelenoidWebdriver } from './selenoid.webdriver';

@Module({
  imports: [ConfigModule, LoggerModule, DockerModule, MongoModule],
  providers: [
    SelenoidProvider,
    SelenoidWebdriver,
    Login,
    Logout,
    QueueStatus,
    GetExtension,
    ExtensionForward,
    MailForward,
    EsetLogin,
    EsetLogout,
    Eset,
  ],
  exports: [SelenoidProvider],
})
export class SelenoidModule {}
