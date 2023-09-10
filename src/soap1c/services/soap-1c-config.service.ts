import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Soap1cRequestData } from '../interfaces/soap1c.enum';
import { Erp1cKolchuginoExtension, Erp1cNumber } from '@app/config/config';
import { SetIDData, SetNumberData, Soap1cConfig } from '../interfaces/soap1c.interface';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class Soap1CConfigService {
  private readonly default1cUrl: string;

  constructor(private readonly configService: ConfigService, private readonly logger: LoggerService) {
    this.default1cUrl = this.configService.get('server1C.default.url');
  }

  public get(data: Soap1cRequestData): Soap1cConfig {
    try {
      if ('localExtension' in data) {
        return this.getByLocalExtension(data);
      } else if ('dialedNumber' in data) {
        return this.getByDialedNumber(data);
      }
      return { url: this.default1cUrl };
    } catch (e) {
      this.logger.error(e);
      return { url: this.default1cUrl };
    }
  }

  private getByDialedNumber(data: Soap1cRequestData): Soap1cConfig {
    if (data.dialedNumber == Erp1cNumber) return this.erpConfig();
    return { url: this.default1cUrl };
  }

  private getByLocalExtension(data: SetIDData | SetNumberData): Soap1cConfig {
    if (Erp1cKolchuginoExtension.includes(data.localExtension)) return this.erpConfig();
    return { url: this.default1cUrl };
  }

  private erpConfig(): Soap1cConfig {
    return {
      url: this.configService.get('server1C.erp.url'),
      config: {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(`${this.configService.get('server1C.erp.username')}:${this.configService.get('server1C.erp.password')}`).toString(
              'base64',
            ),
        },
      },
    };
  }
}
