import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Soap1cRequestData } from '../interfaces/soap1c.enum';
import { Erp1cKolchuginoExtension, Erp1cNumber } from '@app/config/config';
import { SetIDData, SetNumberData } from '../interfaces/soap1c.interface';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class GetSoap1cUrl {
  private readonly default1cUrl: string;
  private readonly erp1cUrl: string;

  constructor(private readonly configService: ConfigService, private readonly logger: LoggerService) {
    this.default1cUrl = this.configService.get('server1C.default.url');
    this.erp1cUrl = this.configService.get('server1C.erp.url');
  }

  public get(data: Soap1cRequestData): string {
    try {
      if ('localExtension' in data) {
        return this.getByLocalExtension(data);
      } else if ('dialedNumber' in data) {
        return this.getByDialedNumber(data);
      }
      return this.default1cUrl;
    } catch (e) {
      this.logger.error(e);
      return this.default1cUrl;
    }
  }

  private getByDialedNumber(data: Soap1cRequestData): string {
    if (data.dialedNumber == Erp1cNumber) return this.erp1cUrl;
    return this.default1cUrl;
  }

  private getByLocalExtension(data: SetIDData | SetNumberData): string {
    if (Erp1cKolchuginoExtension.includes(data.localExtension)) return this.erp1cUrl;
    return this.default1cUrl;
  }
}
