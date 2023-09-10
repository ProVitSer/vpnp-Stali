import { DATE_FORMAT } from '@app/config/app.config';
import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as moment from 'moment';

@Injectable()
export class UtilsService {
  static formatNumber(number: string): string {
    return number.length == 10 ? `8${number}` : number.replace('7', '8').replace(/\D+/g, '');
  }

  static formatNumberToE164(number: string): string {
    if (number[0] === '+' && number.length === 12) return number;
    if (number[0] === '8' && number.length === 11) return `+7${number.slice(1, 11)}`;
    if (number[0] === '7' && number.length === 11) return `+${number}`;
  }

  static isDateNow(dateFrom: string) {
    const nowDate = format(new Date(), DATE_FORMAT);
    return nowDate === dateFrom;
  }

  static timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static secondDiff(startTime: Date, endTime: Date, dateFormat: string): number {
    const start = moment(moment(startTime).local().format(dateFormat), dateFormat);
    const end = moment(moment(endTime).local().format(dateFormat), dateFormat);
    return end.diff(start, 'second');
  }
}
