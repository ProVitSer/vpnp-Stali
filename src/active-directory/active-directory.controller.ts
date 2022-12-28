import { HttpExceptionFilter } from '@app/http-exception.filter';
import {
  Controller,
  Post,
  UseFilters,
  HttpStatus,
  Req,
  Res,
  Query,
  ValidationPipe,
  UsePipes,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ActiveDirectoryService } from './active-directory.service';
import { ADDto } from './dto/ad.dto';

@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@Controller()
export class ActiveDirectoryController {
  constructor(private readonly adService: ActiveDirectoryService) {}

  @Post('ad')
  async setForward(@Req() req: Request, @Query() params: ADDto, @Res() res: Response) {
    try {
      await this.adService.sendModAd(params);
      return res.status(HttpStatus.OK).json({ result: true });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
