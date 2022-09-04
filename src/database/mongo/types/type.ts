import { Document, Schema } from 'mongoose';
import {  Mail, Forward} from '../schemas';

export enum CollectionType {
  mail = 'mail',
  forward = 'forward'
}

export enum LogEventType {
  document_create = 'document_create',
  document_delete = 'document_delete',
  document_update = 'document_update',
  loginSuccess = 'login_success',
  loginFail = 'login_fail',
  token_fail = 'token_fail',
  api_error = 'api_error',
  api_success = 'api_success',
  auth_fail = 'auth_fail',
  data_error = 'data_error',
  ip_address_blocking = 'ip_address_blocking'

}

export enum DbRequestType {
  findAll = 'findAll',
  findById = 'findById',
  updateOne = 'updateOne',
  insert = 'insert',
  delete = 'delete',
  deleteMany = 'deleteMany',
  insertMany = 'insertMany',
  deleteDocumentById = 'deleteDocumentById'
}


export type SchemaType = {
  [key in CollectionType]?: {
    schema: Schema<Document>;
    class: SchemaClassType;
  };
};

type SchemaClassType = typeof Mail | typeof Forward;