import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configuration from '@app/config/config.provides';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const config = new ConfigService(configuration());
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1') 
  await app.listen(config.get('appPort'));

}
bootstrap();
