import { Soap1cActionTypes, Soap1cRequestDataStructType } from "./types";

export interface Soap1cApiRequestInterface {
    action: Soap1cActionTypes;
    data: Soap1cRequestDataStructType;
}

export interface Soap1cProviderInterface {

    getRequestData(requestData: any): Promise<any>;
}


export interface PlainObject  { [key: string]: any };

export interface ReturnNumber {
    incomingNumber: string;
    dialExtension: string;
    channelId: string;
}