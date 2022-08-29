import { LoggerService } from "@app/logger/logger.service";
import { Soap1cProvider } from "@app/soap1c/sopa1c.provider";
import { Soap1cActionTypes } from "@app/soap1c/types/types";
import { UtilsService } from "@app/utils/utils.service";
import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Ari, { Channel, Client, StasisStart } from 'ari-client';
import * as moment from 'moment';
import { ContextDialplanNumberMap } from "../config";

@Injectable()
export class DialplanApplicationService implements OnApplicationBootstrap {
    private client: { ariClient: Ari.Client};
    private dialTrunk = {}
    constructor(
        @Inject('ARI') private readonly ari: { ariClient: Ari.Client}, 
        private readonly configService: ConfigService,
        private readonly logger: LoggerService,
        private readonly soap1c: Soap1cProvider
    ) {
    }

    public async onApplicationBootstrap() {
        this.client = this.ari;
        this.client.ariClient.on('StasisStart', async (event: StasisStart, dialed: Channel) => {
            try {
                this.logger.info(`Событие входящего вызова ${JSON.stringify(event)}`);
                const routeInfo = this.getRouteInfo(event);
                // const routeResult = await this.continueDialplan()
            }catch(e){
                this.logger.info(` Error ARI continueDialplan ${e}`)
            }

        });
        this.client.ariClient.start(this.configService.get('asterisk.ari.application.amocrm') );

    };

    private async continueDialplan(returnChannelId: string, dialplanContext: string, returnDialExtension: string): Promise<string> {
        try {
            this.logger.info(`Перенаправляем вызов в по нужному маршруту ${returnChannelId}  ${dialplanContext}  ${returnDialExtension}`);
            this.logger.info(JSON.stringify(this.dialTrunk));
            delete this.dialTrunk[returnChannelId];
            return await new Promise((resolve, reject) =>{
                this.client.ariClient.channels.continueInDialplan({ channelId: returnChannelId, context: dialplanContext, extension: returnDialExtension },  (err: Error) => {
                    (!!err) ? resolve(`ARI DialplanApplicationService continueDialplan ${returnChannelId} ${dialplanContext} ${returnDialExtension}`):  reject(err);
                })
            })
        } catch(e){
            throw e;
        }

    }

    private async getRouteInfo(event: StasisStart){
        try {
            const incomingNumber = UtilsService.formatNumber(event.channel.caller.number)
            const dialExtension = this.getDialExtension(event);
            this.logger.info(`${incomingNumber} ${dialExtension} ${event.channel.id}`);
            const requestInfo = {
                action: Soap1cActionTypes.getRouteNumber,
                data: {
                    incomingNumber,
                    dialExtension,
                    channelId: event.channel.id
                }
            }
    
            return await this.soap1c.request(requestInfo);
        }catch(e){
            throw e;
        }

    }

    private getDialExtension(event: StasisStart): string{
        if(event.channel.dialplan.context == 'beronet'){
            this.dialTrunk[event.channel.id] = { 'context': event.args[0] };
            return event.args[0];
        } else {
            this.dialTrunk[event.channel.id] = { 'context': event.channel.dialplan.context }
            return ContextDialplanNumberMap[event.channel.dialplan.context]
        }
    }
}