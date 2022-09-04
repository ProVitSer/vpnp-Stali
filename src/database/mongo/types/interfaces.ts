import {CollectionType, DbRequestType} from './type';

export interface PlainObject { [key: string]: any }

export interface MongoRequestParamsInterface {
    criteria?: PlainObject;
    entity: CollectionType;
    requestType: DbRequestType;
    data?: PlainObject;
    fields?: { [name: string]: number };
}

export interface MongoApiResultInterface {
    result: boolean;
    requestType: DbRequestType;
    data?: any;
    resultData?: any;
    message?: any;
    entity: CollectionType;
}