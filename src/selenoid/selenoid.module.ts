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
  MailAuthorization,
  MailSearchNeedUser,
  MailUserForward,
  MailCheckForward,
} from './providers';
import { EsetSearchUser } from './providers/eset/eset.search-user';
import { SelenoidProvider } from './selenoid.provider';
import { SelenoidWebdriver } from './selenoid.webdriver';

const Pbx3cx = [ExtensionForward, Login, Logout, GetExtension, QueueStatus];
const Eset = [EsetLogin, EsetLogout, EsetSearchUser, EsetSetRemoteAccess, EsetGetRemoteAccessStatus];
const Mail = [MailForward, MailUserForward, MailSearchNeedUser, MailAuthorization, MailCheckForward];

@Module({
  imports: [ConfigModule, LoggerModule, DockerModule],
  providers: [SelenoidProvider, SelenoidWebdriver, ...Pbx3cx, ...Eset, ...Mail],
  exports: [SelenoidProvider],
})
export class SelenoidModule {}
