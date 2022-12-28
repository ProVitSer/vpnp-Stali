import { Controller, Post, UseFilters, HttpStatus, Res, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpExceptionFilter } from '@app/http-exception.filter';
import { QueueDto } from './dto/queue.dto';
import { ForwardDto } from './dto/forward.dto';
import { Pbx3cxService } from './pbx3cx.service';

@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@Controller('pbx3cx')
export class Pbx3cxController {
  constructor(private readonly pbx3cxService: Pbx3cxService) {}
  @Post('queue')
  async changeQueueStatus(@Query() params: QueueDto, @Res() res: Response) {
    try {
      await this.pbx3cxService.changeQueueStatus(params);
      return res.status(HttpStatus.OK).json({ result: true });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('forward')
  async changeExtensionForward(@Query() params: ForwardDto, @Res() res: Response) {
    try {
      await this.pbx3cxService.changeExtensionForward(params);
      return res.status(HttpStatus.OK).json({ result: true });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
