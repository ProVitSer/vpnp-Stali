import { XmlService } from '@app/xml/xml.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { NAMESPACE } from './soap1c.constants';
import { PlainObject, Soap1cApiRequestInterface, Soap1cProviderInterface, Soap1cProviders } from './interfaces/soap1c.interface';
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from './interfaces/soap1c.enum';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from '@nestjs/terminus/dist/errors/axios.error';
import { GetRouteNumber, SetID, SetNumber } from './providers';
import { Soap1CConfigService } from './services/soap-1c-config.service';
import { LoggerService } from '@app/logger/logger.service';

@Injectable()
export class Soap1cProvider {
  private serviceContext: string;
  constructor(
    private readonly xml: XmlService,
    private readonly getRouteNumber: GetRouteNumber,
    private readonly setID: SetID,
    private readonly setNumber: SetNumber,
    private readonly httpService: HttpService,
    private readonly soap1cConfig: Soap1CConfigService,
    private readonly logger: LoggerService,
  ) {
    this.serviceContext = Soap1cProvider.name;
  }

  private get providers(): Soap1cProviders {
    return {
      [Soap1cActionTypes.getRouteNumber]: this.getRouteNumber,
      [Soap1cActionTypes.setID]: this.setID,
      [Soap1cActionTypes.setNumber]: this.setNumber,
    };
  }

  public async request<T>(request: Soap1cApiRequestInterface): Promise<T> {
    const { action, data, envelop } = request;
    const provider = this.getProvider(action);
    try {
      const requestData = await provider.getRequestData(data);
      const xmlRequest = await this.makeXmlRequest(requestData, envelop || Soap1cEnvelopeTypes.returnNumber, action);
      this.logger.info(requestData, this.serviceContext);
      const { url, config } = this.soap1cConfig.get(data);

      const response = await firstValueFrom(
        this.httpService.post(url, xmlRequest, <any>config).pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
      );
      const formatResponse = (await this.xml.createObjectFromXmlAsync(response.data)) as T;
      this.logger.info(formatResponse, this.serviceContext);

      return formatResponse;
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }

  private getProvider(action: Soap1cActionTypes): Soap1cProviderInterface {
    return this.providers[action];
  }

  private makeFullData(data: PlainObject, envelope: Soap1cEnvelopeTypes, action: Soap1cActionTypes): PlainObject {
    return {
      'soap:Envelope': {
        '@xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
        [`@xmlns:${NAMESPACE}`]: `${envelope}`,
        'soap:Header': {},
        'soap:Body': {
          [`${NAMESPACE}:${action}`]: this.xml.addNameSpace(data, NAMESPACE),
        },
      },
    };
  }

  private async makeXmlRequest(data: PlainObject, envelope: Soap1cEnvelopeTypes, action: Soap1cActionTypes): Promise<string> {
    return await this.createXml(this.makeFullData(data, envelope, action));
  }

  private async createXml(data: PlainObject): Promise<string> {
    return this.xml.createXmlFromObjectAsync(data, { separateArrayItems: false });
  }
}
