import { HttpExceptionFilter } from '@app/http-exception.filter';
import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Res, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { Response } from 'express';
import { RemoteActivateDto } from './dto/remote-activate.dto';
import { RemoteDeleteDto } from './dto/remote-delete.dto';
import { RemoteDeactivateDto } from './dto/remote-deactivate.dto';
import { RateLimit } from 'nestjs-rate-limiter';
import { RATELIMIT_REQUEST_ERROR } from './remote..constants';
import { MAX_REMOTE_DURATION, MAX_REMOTE_POINT } from '@app/config/app.config';

@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@Controller('remote')
export class RemoteController {
  constructor(private readonly remoteService: RemoteService) {}
  @RateLimit({ keyPrefix: 'activate', points: MAX_REMOTE_POINT, duration: MAX_REMOTE_DURATION, errorMessage: RATELIMIT_REQUEST_ERROR })
  @Post('activate')
  async remoteActivate(@Body() body: RemoteActivateDto, @Res() res: Response) {
    try {
      const result = await this.remoteService.remoteActivate(body);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RateLimit({ keyPrefix: 'activate', points: MAX_REMOTE_POINT, duration: MAX_REMOTE_DURATION, errorMessage: RATELIMIT_REQUEST_ERROR })
  @Post('deactivate')
  async remoteDeactivate(@Body() body: RemoteDeactivateDto, @Res() res: Response) {
    try {
      const result = await this.remoteService.remoteDeactivate(body);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('ad/users')
  async getRemoteAdUsers(@Res() res: Response) {
    try {
      const result = await this.remoteService.getRemoteAdUsers();
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('status/:id')
  async getRemoteStatus(@Param('id') remoteId: string, @Res() res: Response) {
    try {
      const result = await this.remoteService.getRemoteStatus(remoteId);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('delete')
  async deleteRemote(@Body() body: RemoteDeleteDto, @Res() res: Response) {
    try {
      const result = await this.remoteService.deleteRemote(body);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @RateLimit({ keyPrefix: 'activate', points: MAX_REMOTE_POINT, duration: MAX_REMOTE_DURATION, errorMessage: RATELIMIT_REQUEST_ERROR })
  @Get('ad/user/:user')
  async getActualRemoteStatus(@Param('user') user: string, @Res() res: Response) {
    try {
      const result = await this.remoteService.getActualRemoteStatus({ user });
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
