import { Controller, Post, UseFilters, HttpStatus, Req, Body, Res, Query, ValidationPipe, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express'
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpExceptionFilter } from '@app/http-exception.filter';
import { SelenoidProvider } from './selenoid.provider';
import { ActionType } from './types/types';
import { Queue } from './dto/queue.dto';
import { Forward } from './dto/forward.dto';
import { MailForward } from './dto/mailForward.dto';

@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@Controller()
export class SelenoidController {
    constructor(
        private readonly selenoid: SelenoidProvider 
     ) {}
 
    @Post('mail')
    async changeMailForward(
        @Req() req: Request, 
        @Query() params: MailForward,
        @Res() res: Response) {
        try {
            const result = await this.selenoid.change(ActionType.mailForward, params)
            return res.status(HttpStatus.OK).json({ result: true });
        }catch(e){
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
    @Post('queue')
    async setQueueStatus(
        @Req() req: Request, 
        @Query() params: Queue,
        @Res() res: Response) {
        try {
            const result = await this.selenoid.change(ActionType.queueStatus, params)
            return res.status(HttpStatus.OK).json({ result: true });
        }catch(e){
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Post('forward')
    async setForward(
        @Req() req: Request, 
        @Query() params: Forward, 
        @Res() res: Response) {
        try {
            const result = await this.selenoid.change(ActionType.extensionForward, params)
            return res.status(HttpStatus.OK).json({ result: true });
        }catch(e){
            throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}

