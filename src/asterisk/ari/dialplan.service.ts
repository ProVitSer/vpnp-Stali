import { LoggerService } from "@app/logger/logger.service";
import { Soap1cProvider } from "@app/soap1c/sopa1c.provider";
import { ReturnNumberResponseData } from "@app/soap1c/types/interface";
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from "@app/soap1c/types/types";
import { UtilsService } from "@app/utils/utils.service";
import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Ari, { Channel, Client, StasisStart } from 'ari-client';
import { ContextDialplanNumberMap, DEFAULT_ROUTING, LOCAL_ROUTING } from "../config";
import { RouteInfo } from "../types/interface";

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
                const routeInfo = await this.getRouteInfo(event);
                if(routeInfo.returnDialExtension != "000"){
                    await this.continueDialplan(routeInfo.channelId, LOCAL_ROUTING, routeInfo.returnDialExtension);
                } else {
                    await this.continueDialplan(routeInfo.channelId, DEFAULT_ROUTING, routeInfo.returnDialExtension);
                }
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
                });
            })
        } catch(e){
            throw e;
        }

    }

    private async getRouteInfo(event: StasisStart): Promise<RouteInfo>{
        try {
            const incomingNumber = UtilsService.formatNumber(event.channel.caller.number)
            const dialExtension = this.getDialExtension(event);
            this.logger.info(`${incomingNumber} ${dialExtension} ${event.channel.id}`);
            const requestInfo = {
                action: Soap1cActionTypes.getRouteNumber,
                envelop: Soap1cEnvelopeTypes.ReturnNumber,
                data: {
                    incomingNumber,
                    dialExtension,
                    channelId: event.channel.id
                }
            }
    
            const routeInfo =  await this.soap1c.request<ReturnNumberResponseData>(requestInfo);
            const parseRouteInfo = routeInfo.Envelope.Body.ReturnNumberResponse.return.name.split(';');
            return {
                dialExtension,
                returnDialExtension: parseRouteInfo[0],
                channelId: parseRouteInfo[1]

            }
        }catch(e){
            this.logger.error(`На запрос внутреннего номера вернулась ошибка ${e}`);
            this.logger.error(`Ошибка, вызов идет по ${DEFAULT_ROUTING}`);
            await this.continueDialplan(event.channel.id, DEFAULT_ROUTING, this.getDialExtension(event));
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