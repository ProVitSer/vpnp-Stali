import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configuration from '@app/config/config.provides';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const config = new ConfigService(configuration());
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          if (!!error.constraints) {
            return {
              field: error.property,
              error: error.constraints,
            };
          } else if (Array.isArray(error.children) && error.children.length > 0) {
            return formatError(error);
          }
        });
        return new HttpException(messages.length > 1 ? messages : messages[0], HttpStatus.BAD_REQUEST);
      },
    }),
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(config.get('appPort'));
}
bootstrap();

function formatError(error: ValidationError): Array<{ field: string; error: { [type: string]: string } }> {
  const message: Array<{ field: string; error: { [type: string]: string } }> = [];

  function getChildren(childrenError: ValidationError, prop: string) {
    if (Array.isArray(childrenError.children) && childrenError.children.length != 0) {
      for (let i = 0; i < childrenError.children.length; i++) {
        getChildren(childrenError.children[i], `${prop}.${childrenError.children[i].property}`);
      }
    }
    !!childrenError.constraints ? message.push({ field: prop, error: childrenError.constraints }) : '';
  }

  getChildren(error, error.property);

  return message;
}
