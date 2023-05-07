import { DialExtensionByContext } from '@app/config/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AsteriskApiUtilsService {
  static formatIncomingNumber(incomingNumber: string): string {
    return incomingNumber.length == 10 ? `8${incomingNumber}` : incomingNumber;
  }

  static formatDialExtensionByContext(context: string): string {
    return context.length > 7 ? DialExtensionByContext[context] : `8495${context}`;
  }

  static formatDialExtension(dialExtension: string): string {
    return dialExtension.length > 8 ? dialExtension : `8495${dialExtension}`;
  }
}
