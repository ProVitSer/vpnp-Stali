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

export interface SearchNeedUserData {
  email: string;
  userName: string;
}

export interface MailCheckForwardData {
  email: string;
}

export interface MailCheckForwardResult {
  isForwardEnable: boolean;
  email?: string;
}
