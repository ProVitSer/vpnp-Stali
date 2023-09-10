import { Injectable } from '@nestjs/common';
import { SetIDRequestStruct, Soap1cProviderInterface, SetIDData } from '../interfaces/soap1c.interface';

@Injectable()
export class SetID implements Soap1cProviderInterface {
  async getRequestData(requestData: SetIDData): Promise<SetIDRequestStruct> {
    return {
      ID: requestData.channelId,
      ID3CX: requestData.unicue3cxId,
      Number: requestData.dialedNumber,
      DobNumber: requestData.localExtension,
      OutNumber: requestData.incomingNumber,
      DateTime: requestData.callDateTime,
    };
  }
}
