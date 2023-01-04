import { Types } from 'mongoose';
import { type } from 'os';
import { RemoteActivateDto } from '../dto/remote-activate.dto';
import { RemoteDeactivateDto } from '../dto/remote-deactivate.dto';
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

export interface UpdateRemoteStatusData {
  remoteId: string | Types.ObjectId;
  isRemoteAdActive: boolean;
  isRemoteEsetActive: boolean;
}

export type RemoteActivateDtoWithId = RemoteActivateDto & { remoteId: string | Types.ObjectId };
export type RemoteDeactivateDtoWithId = RemoteDeactivateDto & { remoteId: string | Types.ObjectId };

export type RemoteChangeData = RemoteActivateDtoWithId | RemoteDeactivateDtoWithId