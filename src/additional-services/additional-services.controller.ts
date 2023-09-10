import { HttpExceptionFilter } from '@app/exceptions/http-exception/http-exception.filter';
import { Controller, Get, HttpException, HttpStatus, Post, Query, Res, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdditionalServicesService } from './additional-services.service';
import { Response } from 'express';
import { ExtensionForwardDto } from './dto/extension-forward.dto';
import { QueueStatusDto } from './dto/queue-status.dto';
import { MailForwardDto } from './dto/mail-forward.dto';

@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@Controller('additional-services')
export class AdditionalServicesController {
  constructor(private readonly additionalServices: AdditionalServicesService) {}

  @Post('forward/queue')
  async changeQueueStatus(@Query() params: QueueStatusDto, @Res() res: Response) {
    try {
      await this.additionalServices.changeQueueStatus(params);
      return res.status(HttpStatus.OK).json({ result: true });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('forward/mail')
  async changeMailForward(@Query() params: MailForwardDto, @Res() res: Response) {
    try {
      await this.additionalServices.changeMailForward(params);
      return res.status(HttpStatus.OK).json({ result: true });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('forward/extension')
  async changeExtensionForward(@Query() params: ExtensionForwardDto, @Res() res: Response) {
    try {
      await this.additionalServices.changeExtensionForward(params);
      return res.status(HttpStatus.OK).json({ result: true });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('forward/extension/status')
  async getExtensionStatus(@Query('exten') exten: string, @Res() res: Response) {
    try {
      const result = await this.additionalServices.getExtenForwardStatus(exten);
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('forward/mail/status')
  async getMailStatus(@Query('mail') mail: string, @Res() res: Response) {
    try {
      const result = await this.additionalServices.getCurrentMailForward(mail);
      return res.status(HttpStatus.OK).json(result);
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
