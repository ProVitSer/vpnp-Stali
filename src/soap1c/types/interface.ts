import { Soap1cActionTypes, Soap1cEnvelopeTypes, Soap1cRequestData, Soap1cRequestDataStructType } from './types';

export interface Soap1cApiRequestInterface {
  action: Soap1cActionTypes;
  envelop: Soap1cEnvelopeTypes;
  data: Soap1cRequestData;
}

export interface Soap1cProviderInterface {
  getRequestData(requestData: Soap1cRequestData): Promise<Soap1cRequestDataStructType>;
}

export interface PlainObject {
  [key: string]: any;
}

export interface ReturnNumberData {
  incomingNumber: string;
  dialExtension: string;
  channelId: string;
}

export interface ReturnNumberRequestStruct {
  Number: string;
  Number1: string;
  DateTime: string;
  ID: string;
}

export interface SetIdRequestStruct {
  ID: string;
  ID3CX: string;
  Number: string;
  DobNumber: string;
  OutNumber: string;
  DateTime: string;
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
