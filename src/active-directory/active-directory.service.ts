import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoggerService } from '@app/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { AdRemoteDataRequest, AdRemoteStatusResponse, AdRGetUsersResponse } from './interfaces/active-directory.interface';
import { ERROR_GET_AD_USERS, ERROR_SET_AD_REMOTE_STATUS, HEADERS } from './active-directory.constans';

@Injectable()
export class ActiveDirectoryService {
  private serviceContext: string;
  constructor(private readonly configService: ConfigService, private readonly logger: LoggerService, private httpService: HttpService) {
    this.serviceContext = ActiveDirectoryService.name;
  }

  public async setAdRemoteStatus(data: AdRemoteDataRequest) {
    try {
      const result = await this.httpService.put(this.configService.get('adUrl'), data, { headers: HEADERS }).toPromise();
      if (result.status !== 200) {
        throw result.data.error || ERROR_SET_AD_REMOTE_STATUS;
      }
      return result.data as AdRemoteStatusResponse;
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }

  public async getAdUsers() {
    try {
      const result = await this.httpService.get(this.configService.get('adUrl'), { headers: HEADERS }).toPromise();
      if (result.status !== 200) {
        throw result.data.error || ERROR_GET_AD_USERS;
      }
      return result.data as AdRGetUsersResponse;
    } catch (e) {
      this.logger.error(e, this.serviceContext);
      throw e;
    }
  }
}
