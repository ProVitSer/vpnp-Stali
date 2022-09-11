import { Injectable } from '@nestjs/common';
import axios, { HttpService } from '@nestjs/axios';
import { AdRequest } from './types/intefaces';
import { LoggerService } from '@app/logger/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ActiveDirectoryService {
    private serviceContext: string;
    private headers = {
        'User-Agent': 'Vpnp-Stali',
        'Content-Type': 'application/json'
    };
    constructor(    
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
        private httpService: HttpService,
    ){
        this.serviceContext = ActiveDirectoryService.name;
    }

    public async sendModAd(data: AdRequest){
        try {
            return await this.httpService.post(this.configService.get('adUrl'), data, { headers: this.headers } ).toPromise();
        }catch(e){
            this.logger.error(e, this.serviceContext);
            throw e;
        }

    }

}
