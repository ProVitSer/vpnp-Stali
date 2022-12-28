import { Injectable } from '@nestjs/common';
import { SetIdRequestStruct, Soap1cProviderInterface } from '../types/interface';

@Injectable()
export class SetId implements Soap1cProviderInterface {
  async getRequestData(requestData: any): Promise<SetIdRequestStruct> {
    return requestData;
  }
}
