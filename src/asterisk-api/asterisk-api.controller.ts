import { Controller, Get, Res, Query, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AsteriskApiProvider } from './asterisk-api.provider';
import { Response } from 'express';
import { DialExtensionDto } from './dto/dial-extension.dto';
import { GroupCallDto } from './dto/group-call.dto';
import { ExtensionCallDto } from './dto/extension-call.dto';
import { OffHoursDto } from './dto/off-hours.dto';
import { AsteriskActionType } from './interfaces/asteriks-api.enum';

@UsePipes(ValidationPipe)
@Controller('asterisk-api')
export class AsteriskApiController {
  constructor(private readonly asteriskApiProvider: AsteriskApiProvider) {}

  //Set(C_RESULT=${CURL(localhost:8989/api/v1/asterisk-api/dial-extension?incomingNumber=${CALLERID(num)}&context=${CONTEXT}&extension=${EXTEN}&unicueid=${UNIQUEID})});

  @Get('dial-extension')
  async dialExtension(@Res() res: Response, @Query() data: DialExtensionDto): Promise<Response> {
    this.asteriskApiProvider.sendCallInfo(data, AsteriskActionType.DialExtensionCallInfo);
    return res.status(HttpStatus.OK).json({});
  }

  //Set(C_RESULT=${CURL(localhost:8989/api/v1/asterisk-api/group-call?incomingNumber=${CALLERID(num)}&unicueid=${UNIQUEID})});

  @Get('group-call')
  async groupCall(@Res() res: Response, @Query() data: GroupCallDto): Promise<Response> {
    this.asteriskApiProvider.sendCallInfo(data, AsteriskActionType.GroupCallInfo);
    return res.status(HttpStatus.OK).json({});
  }
  //Set(C_RESULT=${CURL(localhost:8989/api/v1/asterisk-api/extension-call?incomingNumber=${CALLERID(num)}&unicueid=${UNIQUEID}&extension=${EXTEN})});

  @Get('extension-call')
  async extensionCall(@Res() res: Response, @Query() data: ExtensionCallDto): Promise<Response> {
    this.asteriskApiProvider.sendCallInfo(data, AsteriskActionType.ExtensionCallInfo);
    return res.status(HttpStatus.OK).json({});
  }

  //Set(C_RESULT=${CURL(localhost:8989/api/v1/asterisk-api/off-hours?incomingNumber=${CALLERID(num)}&dialExtension=${EXTEN})});

  @Get('off-hours')
  async offHours(@Res() res: Response, @Query() data: OffHoursDto): Promise<Response> {
    this.asteriskApiProvider.sendCallInfo(data, AsteriskActionType.NotWorkTimeCallInfo);
    return res.status(HttpStatus.OK).json({});
  }
}
