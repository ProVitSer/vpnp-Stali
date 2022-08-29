import { XmlService } from "@app/xml/xml.service";
import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ReturnNumber } from "./providers/return-number";
import { SetId } from "./providers/set-id";
import { NAMESPACE } from "./types/constaints";
import { PlainObject, Soap1cApiRequestInterface, Soap1cProviderInterface } from "./types/interface";
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from "./types/types";



@Injectable()
export class Soap1cProvider {

    constructor(
        private readonly configService: ConfigService,
        private readonly xml: XmlService,
        private readonly returnNumber: ReturnNumber,
        private readonly setId: SetId,
        private httpService: HttpService,
    ){}

    get providers(): any {
        return {
            [Soap1cActionTypes.getRouteNumber]: this.returnNumber,
            [Soap1cActionTypes.sendCallInfo]: this.setId,
        };
    }

    public async request<T>(request: Soap1cApiRequestInterface): Promise<T> {  
        const provider = this.getProvider(request.action);

        try {
            const data = await provider.getRequestData(request.data);
            const xmlRequest = await this.makeXmlRequest(data, request.envelop, request.action);
            const response = await this.httpService.post(this.configService.get('server1C.url'), xmlRequest).toPromise();
            return await this.xml.createObjectFromXmlAsync(response.data) as T;
        }catch(e){
            throw e;
        }
    }

    private getProvider(action: Soap1cActionTypes): Soap1cProviderInterface {
        return this.providers[action];
    }

    private makeFullData(data: PlainObject, envelope: Soap1cEnvelopeTypes ,action: Soap1cActionTypes): PlainObject {    
        
        return {
            'soap:Envelope': {
                '@xmlns:soap': 'http://www.w3.org/2003/05/soap-envelope',
                [`@xmlns:${NAMESPACE}`]: `${envelope}`,
                'soap:Header': {},
                'soap:Body': {
                    [`${NAMESPACE}:${action}`]: this.xml.addNameSpace(data, NAMESPACE)
                }
            }
        }
    }


    private async makeXmlRequest(data: PlainObject, envelope: Soap1cEnvelopeTypes, action: Soap1cActionTypes): Promise<string> {
        return await this.createXml(this.makeFullData(data, envelope, action));
    }

    private async createXml(data: PlainObject): Promise<string> {
        return this.xml.createXmlFromObjectAsync(data, { separateArrayItems :false });
    }
}