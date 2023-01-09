import { Injectable } from '@nestjs/common';
import { SetNumberRequestStruct, Soap1cProviderInterface, SetNumberData } from '../interfaces/soap1c.interface';

@Injectable()
export class SetNumber implements Soap1cProviderInterface {
  async getRequestData(requestData: SetNumberData): Promise<SetNumberRequestStruct> {
    return {
      ID: requestData.channelId,
      InNumber: requestData.incomingNumber,
      DobNumber: requestData.localExtension,
      OurNumber: requestData.dialedNumber,
      DateTimeIn: requestData.callDateTime,
    };
  }
}
