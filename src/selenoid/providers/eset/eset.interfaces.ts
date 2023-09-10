import { EsetStatus } from './eset.enum';

export interface EsetSetRemoteAccessData {
  userName: string;
  phoneNumber?: string;
  status: EsetStatus;
}

export interface EsetGetRemoteAccessStatusData {
  userName: string;
}
