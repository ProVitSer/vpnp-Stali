import { Injectable } from '@nestjs/common';
import { DATE_FORMAT } from './util.constants';
import { format } from 'date-fns';

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
}
