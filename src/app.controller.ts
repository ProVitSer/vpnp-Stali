import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CallInfoService } from './database/orm/call-info.service';
import { CallService } from './database/orm/call.service';
import { Soap1cProvider } from './soap1c/sopa1c.provider';
import { ReturnNumberResponseData } from './soap1c/types/interface';
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from './soap1c/types/types';

@Controller()
export class AppController {}
