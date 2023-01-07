import { modelOptions, prop, Severity } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ExtensionForwardRuleType, ServicesType } from './interfaces/additional-services.enum';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AdditionalServicesModel extends Base {}
@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
    customName: 'additionalServices',
  },
})
export class AdditionalServicesModel extends TimeStamps {
  @prop({ enum: ServicesType })
  service: ServicesType;

  @prop({ enum: ExtensionForwardRuleType })
  type?: ExtensionForwardRuleType;

  @prop()
  number?: string;

  @prop()
  from?: string;

  @prop()
  to?: string;

  @prop()
  dateFrom?: string;

  @prop()
  dateTo?: string;

  @prop()
  exten?: string;

  @prop()
  status: boolean;

  @prop({ default: false })
  revertChange: boolean;
}
