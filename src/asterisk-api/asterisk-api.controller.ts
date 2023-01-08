import { LoggerService } from '@app/logger/logger.service';
import { Controller, Get, Req, Res, Query } from '@nestjs/common';
import { AsteriskProvider } from './asterisk-api.provider';
import { Response } from 'express';

@Controller('asterisk-api')
export class AsteriskApiController {
  constructor(private readonly asteriskProvider: AsteriskProvider, private readonly logger: LoggerService) {}

  @Get('*')
  async sendСhanges(@Req() req: any, @Res() res: Response, @Query() callInfo: any): Promise<void> {
    const response = await this.asteriskProvider.sendCallInfo(callInfo);
  }
}
