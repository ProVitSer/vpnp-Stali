import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFactory } from './utils.pipe';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = ValidationExceptionFactory(errors);

        return new HttpException(messages.length > 1 ? messages : messages[0], HttpStatus.BAD_REQUEST);
      },
    });
  }
}
