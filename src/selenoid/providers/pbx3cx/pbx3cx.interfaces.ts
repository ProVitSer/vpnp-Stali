export interface QueueStatusData {
  exten: string;
  status: boolean;
}

export interface ExtensionStatusData {
  exten: string;
  type: ForwardRuleType;
  number: string;
  dateFrom: string;
  dateTo: string;
  status: boolean;
  change?: boolean;
}

export enum ForwardRuleType {
  mobile = 'mobile',
  extension = 'extension',
  external = 'external',
}
