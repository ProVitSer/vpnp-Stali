import { AxiosRequestConfig } from '@nestjs/terminus/dist/health-indicator/http/axios.interfaces';
import { Soap1cActionTypes, Soap1cEnvelopeTypes, Soap1cRequestData, Soap1cRequestDataStructType } from './soap1c.enum';

export interface Soap1cApiRequestInterface {
  action: Soap1cActionTypes;
  envelop?: Soap1cEnvelopeTypes;
  data: Soap1cRequestData;
}

export type Soap1cProviders = {
  [key in Soap1cActionTypes]: Soap1cProviderInterface;
};

export interface Soap1cProviderInterface {
  getRequestData(requestData: Soap1cRequestData, action?: Soap1cActionTypes): Promise<Soap1cRequestDataStructType>;
}

export interface PlainObject {
  [key: string]: any;
}

interface BaseCallData {
  channelId: string;
  incomingNumber: string;
  dialedNumber: string;
  callDateTime: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReturnNumberData extends BaseCallData {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReturnNumberNotWorkTimeData extends Omit<BaseCallData, 'channelId'> {}

export interface SetIDData extends BaseCallData {
  unicue3cxId: string;
  localExtension: string;
}

export interface SetNumberData extends BaseCallData {
  localExtension: string;
}

export interface ReturnNumberRequestStruct {
  Number: string;
  Number1: string;
  DateTime: string;
  ID: string;
}

export interface BaseCallInfoRequestStruct {
  ID: string;
  DobNumber: string;
}

export interface SetIDRequestStruct extends BaseCallInfoRequestStruct {
  ID3CX: string;
  Number: string;
  OutNumber: string;
  DateTime: string;
}

export interface SetNumberRequestStruct extends BaseCallInfoRequestStruct {
  InNumber: string;
  OurNumber: string;
  DateTimeIn: string;
}

export interface ReturnNumberResponseData {
  Envelope: {
    Body: {
      ReturnNumberResponse: {
        return: {
          name: string;
        };
      };
    };
  };
}

export interface Soap1cConfig {
  url: string;
  config?: AxiosRequestConfig;
}
