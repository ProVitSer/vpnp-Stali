import { Controller, Get, Res, Query, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { SmartRoutingApiProvider } from './smart-routing-api.provider';
import { Response } from 'express';
import { DialExtensionDto } from './dto/dial-extension.dto';
import { GroupCallDto } from './dto/group-call.dto';
import { ExtensionCallDto } from './dto/extension-call.dto';
import { OffHoursDto } from './dto/off-hours.dto';
import { SmartRoutingActionType } from './interfaces/smart-routing-api.enum';

@UsePipes(ValidationPipe)
@Controller('smart-routing-api')
export class SmartRoutingApiController {
  constructor(private readonly smartRoutingApiProvider: SmartRoutingApiProvider) {}

  //Set(C_RESULT=${CURL(10.0.100.46:8989/api/v1/smart-routing-api/dial-extension?incomingNumber=${CALLERID(num)}&context=${CONTEXT}&extension=${EXTEN}&unicueid=${UNIQUEID})});
  @Get('dial-extension')
  async dialExtension(@Res() res: Response, @Query() data: DialExtensionDto): Promise<Response> {
    this.smartRoutingApiProvider.sendCallInfo(data, SmartRoutingActionType.DialExtensionCallInfo);
    return res.status(HttpStatus.OK).json({});
  }

  //Set(C_RESULT=${CURL(10.0.100.46:8989/api/v1/smart-routing-api/group-call?incomingNumber=${CALLERID(num)}&unicueid=${UNIQUEID})});
  @Get('group-call')
  async groupCall(@Res() res: Response, @Query() data: GroupCallDto): Promise<Response> {
    this.smartRoutingApiProvider.sendCallInfo(data, SmartRoutingActionType.GroupCallInfo);
    return res.status(HttpStatus.OK).json({});
  }

  //Set(C_RESULT=${CURL(10.0.100.46:8989/api/v1/smart-routing-api/extension-call?incomingNumber=${CALLERID(num)}&unicueid=${UNIQUEID}&extension=${EXTEN})});
  @Get('extension-call')
  async extensionCall(@Res() res: Response, @Query() data: ExtensionCallDto): Promise<Response> {
    this.smartRoutingApiProvider.sendCallInfo(data, SmartRoutingActionType.ExtensionCallInfo);
    return res.status(HttpStatus.OK).json({});
  }

  //Set(C_RESULT=${CURL(10.0.100.46:8989/api/v1/smart-routing-api/off-hours?incomingNumber=${CALLERID(num)}&dialExtension=${EXTEN})});
  @Get('off-hours')
  async offHours(@Res() res: Response, @Query() data: OffHoursDto): Promise<Response> {
    this.smartRoutingApiProvider.sendCallInfo(data, SmartRoutingActionType.NotWorkTimeCallInfo);
    return res.status(HttpStatus.OK).json({});
  }
}
