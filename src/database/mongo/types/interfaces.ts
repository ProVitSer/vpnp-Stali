import { Forward, Mail } from '../schemas';
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

export interface ChangeBackData {
    type: CollectionType;
    data: Array<Mail|Forward>
}
export interface UpdateDataStruct {
    type: CollectionType;
    id: string;
    field: {[key: string]: any};
}