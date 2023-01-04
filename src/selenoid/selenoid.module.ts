import { DockerModule } from '@app/docker/docker.module';
import { LoggerModule } from '@app/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  Login,
  Logout,
  QueueStatus,
  GetExtension,
  ExtensionForward,
  MailForward,
  EsetLogin,
  EsetLogout,
  EsetSetRemoteAccess,
  EsetGetRemoteAccessStatus,
} from './providers';
import { EsetSearchUser } from './providers/eset/search-user';
import { SelenoidProvider } from './selenoid.provider';
import { SelenoidWebdriver } from './selenoid.webdriver';

@Module({
  imports: [ConfigModule, LoggerModule, DockerModule],
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
    EsetSearchUser,
    EsetSetRemoteAccess,
    EsetGetRemoteAccessStatus,
  ],
  exports: [SelenoidProvider],
})
export class SelenoidModule {}
