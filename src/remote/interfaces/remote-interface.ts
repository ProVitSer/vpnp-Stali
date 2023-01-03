import { Types } from 'mongoose';
import { RemoteStatus } from './remote-enum';

export interface RemoteResponse {
  remoteId: string | Types.ObjectId;
  status: RemoteStatus;
  users?: Array<string>;
  error?: Record<string, unknown>;
  remoteStatus?: {
    isRemoteAdActive: boolean;
    isRemoteEsetActive: boolean;
  };
}
