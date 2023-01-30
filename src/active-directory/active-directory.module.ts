import { LoggerModule } from '@app/logger/logger.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActiveDirectoryService } from './active-directory.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
        validateStatus: () => true,
      }),
    }),
  ],
  controllers: [],
  providers: [ActiveDirectoryService],
  exports: [ActiveDirectoryService],
})
export class ActiveDirectoryModule {}
