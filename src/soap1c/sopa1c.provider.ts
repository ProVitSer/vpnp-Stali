import { XmlService } from '@app/xml/xml.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReturnNumber } from './providers/return-number';
import { SetID } from './providers/set-id';
import { NAMESPACE } from './soap1c.constants';
import { PlainObject, Soap1cApiRequestInterface, Soap1cProviderInterface, Soap1cProviders } from './interfaces/soap1c.interface';
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from './interfaces/soap1c.enum';
import { SetNumber } from './providers/set-number';

@Injectable()
export class Soap1cProvider {
  private serviceContext: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly xml: XmlService,
    private readonly returnNumber: ReturnNumber,
    private readonly setID: SetID,
    private readonly setNumber: SetNumber,
    private httpService: HttpService,
  ) {
    this.serviceContext = Soap1cProvider.name;
  }

  private get providers(): Soap1cProviders {
    return {
      [Soap1cActionTypes.getRouteNumber]: this.returnNumber,
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
      const response = await this.httpService.post(this.configService.get('server1C.url'), xmlRequest).toPromise();
      return (await this.xml.createObjectFromXmlAsync(response.data)) as T;
    } catch (e) {
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
