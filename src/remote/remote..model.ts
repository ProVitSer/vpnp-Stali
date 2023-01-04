import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { RemoteStatus } from './interfaces/remote-enum';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RemoteModel extends Base {}
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
    customName: 'notification',
  },
})
export class RemoteModel extends TimeStamps {
  @prop({ enum: RemoteStatus, default: RemoteStatus.inProgress })
  status: RemoteStatus;

  @prop()
  user: string;

  @prop()
  mobile: string;

  @prop()
  email: string;

  @prop()
  dateFrom: string;

  @prop()
  dateTo: string;

  @prop()
  remoteData: { [key: string]: any };
}
