import { Injectable } from '@nestjs/common';
import { ReturnNumberData, ReturnNumberRequestStruct, Soap1cProviderInterface } from '../types/interface';
import * as moment from 'moment';

@Injectable()
export class ReturnNumber implements Soap1cProviderInterface {
  async getRequestData(requestData: ReturnNumberData): Promise<ReturnNumberRequestStruct> {
    return {
      Number: requestData.incomingNumber,
      Number1: requestData.dialExtension,
      DateTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
      ID: requestData.channelId,
    };
  }
}
