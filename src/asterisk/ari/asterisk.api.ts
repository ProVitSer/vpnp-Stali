import { LoggerService } from "@app/logger/logger.service";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ARI from 'ari-client';

@Injectable()
export class AsteriskApi {
    private serviceContext: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: LoggerService
    ){
        this.serviceContext = AsteriskApi.name;
    }

    public async ping(){
        try {
            const ariClient = await ARI.connect(this.configService.get('asterisk.ari.url'), this.configService.get('asterisk.ari.user'), this.configService.get('asterisk.ari.password'));
            return new Promise((resolve) => {
                ariClient.on('WebSocketConnected', () => {
                    ariClient.on('pong', () => {
                        resolve(true)
                    });
                    ariClient.ping();
                })
            })
        }catch(e){
            throw e;
        }
    }
    
}