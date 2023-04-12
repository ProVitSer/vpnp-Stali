import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configuration from '@app/config/config.provides';
import { GlobalValidationPipe } from './pipes/global-validation.pipe';

async function bootstrap() {
  const config = new ConfigService(configuration());
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new GlobalValidationPipe());
  app.setGlobalPrefix('api/v1');
  await app.listen(config.get('appPort'));
}
bootstrap();
