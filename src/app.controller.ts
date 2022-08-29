import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CallInfoService } from './database/orm/call-info.service';
import { Soap1cProvider } from './soap1c/sopa1c.provider';
import { Soap1cActionTypes } from './soap1c/types/types';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly soap: Soap1cProvider
    ){}

  @Get('cat')
  getHello(): string {
    return this.appService.getHello();
    const requestInfo = {
      action: Soap1cActionTypes.getRouteNumber,
      data: {
          incomingNumber: '89081427715',
          dialExtension: '74733003888',
          channelId: '1661779203.388464'
      }
  }
    // console.log(this.soap.request(requestInfo));
    return ''
  }
}

