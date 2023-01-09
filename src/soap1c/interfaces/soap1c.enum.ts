import {
  ReturnNumberData,
  ReturnNumberNotWorkTimeData,
  ReturnNumberRequestStruct,
  SetIDData,
  SetIDRequestStruct,
  SetNumberData,
  SetNumberRequestStruct,
} from './soap1c.interface';

export enum Soap1cActionTypes {
  getRouteNumber = 'ReturnNumber',
  setID = 'SetID',
  setNumber = 'SetNumber',
}

export enum Soap1cEnvelopeTypes {
  returnNumber = 'ReturnNumber',
}

export type Soap1cRequestData = ReturnNumberData | SetIDData | SetNumberData | ReturnNumberNotWorkTimeData;
export type Soap1cRequestDataStructType = ReturnNumberRequestStruct | SetIDRequestStruct | SetNumberRequestStruct;
