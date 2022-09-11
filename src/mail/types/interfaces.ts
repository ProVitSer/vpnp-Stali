import { HealthCheckStatusType } from "@app/health/types/type";

export interface SendMail {
    to: string | string[];
    from?: string;
    subject?: string;
    context: {[key: string]: any};
    template: string
}

export const MailSubjectTypeMap: { [status in HealthCheckStatusType]: string } = {
    [HealthCheckStatusType.ok]: "All of Service in UP",
    [HealthCheckStatusType.error]: "Some of Service is DOWN"
}