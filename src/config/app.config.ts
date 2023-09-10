import { CronExpression } from '@nestjs/schedule';

export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATE_TIME_3CX_FORMAT = 'DD-MM-YYYY HH:mm:ss';
export const DEFERRED__CHANGES_ACTIVATE_TIME = CronExpression.EVERY_DAY_AT_1AM;
export const DEFERRED_CHANGES_DEACTIVATE_TIME = CronExpression.EVERY_DAY_AT_2AM;
export const DEFERRED_PBX_SET_FROWARD_TIME = CronExpression.EVERY_DAY_AT_3AM;
export const REVERT_PBX_SET_FROWARD_TIME = CronExpression.EVERY_DAY_AT_4AM;
export const MAX_REMOTE_PROCESS = 2;
export const MAX_REMOTE_POINTS = 2;
export const MAX_REMOTE_DURATION = 20;
export const MIN_CALL_SECOND = 5;
