import { Injectable } from '@nestjs/common';
import { ReturnNumberData, ReturnNumberRequestStruct, Soap1cProviderInterface } from '../interfaces/soap1c.interface';
import * as moment from 'moment';
import { CALL_DATE_TIME_FORMAT } from '../soap1c.constants';

@Injectable()
export class GetRouteNumber implements Soap1cProviderInterface {
  async getRequestData(requestData: ReturnNumberData): Promise<ReturnNumberRequestStruct> {
    return {
      Number: requestData.incomingNumber,
      Number1: requestData.dialedNumber,
      DateTime: moment().format(CALL_DATE_TIME_FORMAT),
      ID: requestData.channelId,
    };
  }
}
