import { HttpExceptionFilter } from '@app/http-exception.filter';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RemoteService } from './remote.service';
import { Response } from 'express';
import { RemoteActivateDto } from './dto/remote-activate.dto';
import { RemoteDeleteDto } from './dto/remote-delete.dto';
import { RemoteDeactivateDto } from './dto/remote-deactivate.dto';

@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@Controller('remote')
export class RemoteController {
  constructor(private readonly remoteService: RemoteService) {}
  @Post('activate')
  async remoteActivate(@Body() body: RemoteActivateDto, @Res() res: Response) {
    try {
      const result = await this.remoteService.remoteActivate(body);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

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

  @Delete('delete')
  async deleteRemote(@Body() body: RemoteDeleteDto, @Res() res: Response) {
    try {
      const result = await this.remoteService.deleteRemote(body);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:user')
  async getActualRemoteStatus(@Param('user') user: string, @Res() res: Response) {
    try {
      const result = await this.remoteService.getActualRemoteStatus({ user });
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
