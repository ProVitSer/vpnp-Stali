export interface MailForwardData {
  from: string;
  to: string;
  dateFrom: string;
  dateTo: string;
  status: boolean;
  change?: boolean;
}

export interface GetMailForwardStatus {
  isForwardEnable: boolean;
  email?: string;
}
