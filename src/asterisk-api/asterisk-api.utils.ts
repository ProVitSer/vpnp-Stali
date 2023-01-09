import { Injectable } from '@nestjs/common';

@Injectable()
export class AsteriskApiUtilsService {
  static formatIncomingNumber(incomingNumber: string): string {
    return incomingNumber.length == 10 ? `8${incomingNumber}` : incomingNumber;
  }

  static formatDialExtension(formatDialExtension: string): string {
    return formatDialExtension.length > 8 ? formatDialExtension : `8495${formatDialExtension}`;
  }
}
