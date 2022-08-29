import {Inject, Injectable} from '@nestjs/common';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import 'winston-daily-rotate-file';
import { createLogger } from 'winston';
const { combine, timestamp, label, printf, splat } = winston.format;

@Injectable()
export class LoggerService  {
    private context = 'StaliRRC';

    constructor(
        @Inject('winston') private readonly logger: winston.Logger,

    ) {}

    setContext(context: string) {
        this.context = context;
      }

    info(message: any): void {
        this.logger.info(message, { context: `${this.context}`  });
    }

    debug(message: string): void {
        this.logger.debug(message, { context: `${this.context}` });
    }

    error(message: string): void {
        this.logger.error(message, { context: `${this.context}`  });
    }
}