import { ReturnNumberData, ReturnNumberRequestStruct, SetIdRequestStruct } from './soap1c.interface';

export enum Soap1cActionTypes {
  getRouteNumber = 'ReturnNumber',
  sendCallInfo = 'SetID',
}

export enum Soap1cEnvelopeTypes {
  ReturnNumber = 'ReturnNumber',
}

export type Soap1cRequestData = ReturnNumberData;
export type Soap1cRequestDataStructType = ReturnNumberRequestStruct | SetIdRequestStruct;
