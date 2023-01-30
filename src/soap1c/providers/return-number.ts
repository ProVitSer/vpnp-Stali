import { Injectable } from '@nestjs/common';
import { ReturnNumberData, ReturnNumberRequestStruct, Soap1cProviderInterface } from '../interfaces/soap1c.interface';
import * as moment from 'moment';

@Injectable()
export class ReturnNumber implements Soap1cProviderInterface {
  async getRequestData(requestData: ReturnNumberData): Promise<ReturnNumberRequestStruct> {
    return {
      Number: requestData.incomingNumber,
      Number1: requestData.dialedNumber,
      DateTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
      ID: requestData.channelId,
    };
  }
}
