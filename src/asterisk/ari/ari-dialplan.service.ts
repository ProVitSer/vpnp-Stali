import { ContextDialplanNumberMap } from '@app/config/config';
import { LoggerService } from '@app/logger/logger.service';
import { Soap1cProvider } from '@app/soap1c/sopa1c.provider';
import { ReturnNumberResponseData, Soap1cApiRequestInterface } from '@app/soap1c/interfaces/soap1c.interface';
import { Soap1cActionTypes, Soap1cEnvelopeTypes } from '@app/soap1c/interfaces/soap1c.enum';
import { UtilsService } from '@app/utils/utils.service';
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Ari, { StasisStart } from 'ari-client';
import { DEFAULT_NOT_FOUND_EXTENSION, DEFAULT_ROUTING, E1_GATEWAY, LOCAL_ROUTING } from '../asterisk.constants';
import { RouteInfo } from '../types/interface';
import * as moment from 'moment';
import { CALL_DATE_TIME_FORMAT } from '@app/soap1c/soap1c.constants';

@Injectable()
export class DialplanApplicationService implements OnApplicationBootstrap {
  private client: { ariClient: Ari.Client };
  private serviceContext: string;
  constructor(
    @Inject('ARI') private readonly ari: { ariClient: Ari.Client },
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly soap1c: Soap1cProvider,
  ) {
    this.serviceContext = DialplanApplicationService.name;
  }

  public async onApplicationBootstrap() {
    if (!process.env.NODE_APP_INSTANCE || Number(process.env.NODE_APP_INSTANCE) === 0) {
      this.client = this.ari;
      this.client.ariClient.on('StasisStart', async (event: StasisStart) => {
        try {
          this.logger.info(`Событие входящего вызова ${JSON.stringify(event)}`, this.serviceContext);
          const routeInfo = await this.getRouteInfo(event);
          this.logger.info(`${JSON.stringify(routeInfo)}`, this.serviceContext);

          if (routeInfo.returnDialExtension != DEFAULT_NOT_FOUND_EXTENSION) {
            await this.continueDialplan(routeInfo.channelId, LOCAL_ROUTING, routeInfo.returnDialExtension);
          } else {
            await this.continueDialplan(routeInfo.channelId, DEFAULT_ROUTING, routeInfo.dialedNumber);
          }
        } catch (e) {
          this.logger.info(` Error ARI continueDialplan ${e}`, this.serviceContext);
        }
      });
      this.client.ariClient.start(this.configService.get('asterisk.ari.application'));
    }
  }

  private async continueDialplan(returnChannelId: string, dialplanContext: string, dialedNumber: string): Promise<string> {
    try {
      this.logger.info(
        `Перенаправляем вызов в по нужному маршруту ${returnChannelId}  ${dialplanContext}  ${dialedNumber}`,
        this.serviceContext,
      );
      return await new Promise((resolve, reject) => {
        this.client.ariClient.channels.continueInDialplan(
          {
            channelId: returnChannelId,
            context: dialplanContext,
            extension: dialedNumber,
          },
          (err: Error) => {
            err == null
              ? resolve(`ARI DialplanApplicationService continueDialplan ${returnChannelId} ${dialplanContext} ${dialedNumber}`)
              : reject(err);
          },
        );
      });
    } catch (e) {
      throw e;
    }
  }

  private async getRouteInfo(event: StasisStart): Promise<RouteInfo> {
    try {
      const requestInfo = this.getSoapRequestInfo(event);
      this.logger.info(`${JSON.stringify(requestInfo)}`, this.serviceContext);
      const routeInfo = await this.soap1c.request<ReturnNumberResponseData>(requestInfo);
      const parseRouteInfo = routeInfo.Envelope.Body.ReturnNumberResponse.return.name.split(';');
      return {
        dialedNumber: requestInfo.data.dialedNumber,
        returnDialExtension: parseRouteInfo[0],
        channelId: parseRouteInfo[1],
      };
    } catch (e) {
      this.logger.error(`На запрос внутреннего номера вернулась ошибка ${e}`, this.serviceContext);
      this.logger.error(`Ошибка, вызов идет по ${DEFAULT_ROUTING}`, this.serviceContext);
      await this.continueDialplan(event.channel.id, DEFAULT_ROUTING, this.getDialExtension(event));
    }
  }

  private getSoapRequestInfo(event: StasisStart): Soap1cApiRequestInterface {
    const incomingNumber = UtilsService.formatNumber(event.channel.caller.number);
    const dialedNumber = this.getDialExtension(event);
    this.logger.info(`${incomingNumber} ${dialedNumber} ${event.channel.id}`, this.serviceContext);
    return {
      action: Soap1cActionTypes.getRouteNumber,
      envelop: Soap1cEnvelopeTypes.returnNumber,
      data: {
        incomingNumber,
        dialedNumber,
        channelId: event.channel.id,
        callDateTime: moment().format(CALL_DATE_TIME_FORMAT),
      },
    };
  }

  private getDialExtension(event: StasisStart): string {
    if (event.channel.dialplan.context == E1_GATEWAY) {
      return event.args[0];
    } else {
      return ContextDialplanNumberMap[event.channel.dialplan.context];
    }
  }
}
