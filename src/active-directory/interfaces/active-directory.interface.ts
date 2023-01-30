import { AdActionTypes } from './active-directory.enum';

export interface AdRemoteDataRequest {
  user: string;
  action: AdActionTypes;
}

export interface AdRemoteStatusResponse {
  result: boolean;
}

export interface AdRGetUsersResponse {
  result: boolean;
  data: Array<string>;
}
