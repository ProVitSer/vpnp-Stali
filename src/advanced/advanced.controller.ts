import { Controller, Post, UseFilters, HttpStatus, Req, Res, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpExceptionFilter } from '@app/http-exception.filter';
import { MailForwardDto } from './dto/mailForward.dto';
import { AdvancedService } from './advanced.service';

@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@Controller('advanced')
export class AdvancedController {
  constructor(private readonly advancedService: AdvancedService) {}

  @Post('mail')
  async changeMailForward(@Query() params: MailForwardDto, @Res() res: Response) {
    try {
      await this.advancedService.changeMailForward(params);
      return res.status(HttpStatus.OK).json({ result: true });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
