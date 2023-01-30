import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import * as ARI from 'ari-client';

@Injectable()
export class AsteriskHealthIndicator extends HealthIndicator {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  public async ping(key: string): Promise<HealthIndicatorResult> {
    try {
      const ariClient = await ARI.connect(
        this.configService.get('asterisk.ari.url'),
        this.configService.get('asterisk.ari.user'),
        this.configService.get('asterisk.ari.password'),
      );
      return new Promise((resolve) => {
        ariClient.on('WebSocketConnected', () => {
          ariClient.on('pong', () => {
            resolve(super.getStatus(key, true));
          });
          ariClient.ping();
        });
      });
    } catch (e) {
      throw new HealthCheckError(`${key} failed`, this.getStatus(key, false, { message: e }));
    }
  }
}
