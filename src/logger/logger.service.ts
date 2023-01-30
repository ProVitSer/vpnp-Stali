import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService {
  private context = 'StaliRRC';

  constructor(@Inject('winston') private readonly logger: winston.Logger) {}

  info(message: any, serviceContext?: string): void {
    this.logger.info(message, { context: `${this.context}-${serviceContext}` });
  }

  debug(message: any, serviceContext?: string): void {
    this.logger.debug(message, { context: `${this.context}-${serviceContext}` });
  }

  error(message: any, serviceContext?: string): void {
    this.logger.error(message, { context: `${this.context}-${serviceContext}` });
  }
}
