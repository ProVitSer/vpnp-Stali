import { ReturnNumber } from "./interface";

export enum Soap1cActionTypes {
    getRouteNumber = 'ReturnNumber',
    sendCallInfo = 'SetID'
}


export type Soap1cRequestDataStructType = ReturnNumber;