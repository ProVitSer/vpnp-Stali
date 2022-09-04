import { Schemas } from './config';
import { Schema } from 'mongoose';
import { MongoApiResultInterface } from './types/interfaces';
import { CollectionType, DbRequestType } from './types/type';

export default (): { name: string; schema: Schema }[] => {
  return Object.values(Schemas).map((s) => ({
    name: s.class.name,
    schema: s.schema,
  }));
};


export class DBResultError implements MongoApiResultInterface {
  result = false;
  requestType: DbRequestType;
  entity: CollectionType;
  message: any;

  constructor(requestType: DbRequestType, entity: CollectionType, message: any) {
      this.requestType = requestType;
      this.message = message;
      this.entity = entity;
  }
}

export class DBResultSuccess implements MongoApiResultInterface {
  result = true;
  requestType: DbRequestType;
  entity: CollectionType;
  data: any;
  resultData: any;

  constructor(requestType: DbRequestType, entity: CollectionType, data: any, resultData: any) {
      this.requestType = requestType;
      this.data = data;
      this.resultData = resultData;
      this.entity = entity;
  }
}
