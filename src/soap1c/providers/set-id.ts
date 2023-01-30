import { Injectable } from '@nestjs/common';
import { SetIDRequestStruct, Soap1cProviderInterface, SetIDData } from '../interfaces/soap1c.interface';

@Injectable()
export class SetID implements Soap1cProviderInterface {
  async getRequestData(requestData: SetIDData): Promise<SetIDRequestStruct> {
    return {} as SetIDRequestStruct;
  }
}
