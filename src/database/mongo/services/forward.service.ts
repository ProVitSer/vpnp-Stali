import * as moment from 'moment';
import { ExtensionStatusData } from '@app/selenoid/interfaces/interfaces';
import { Injectable } from '@nestjs/common';
import { MongoService } from '../mongo.service';
import { CollectionType, DbRequestType } from '../types/type';
import { Forward } from '../schemas';

@Injectable()
export class ForwardService {
  private serviceContext: string;

  constructor(private readonly mongo: MongoService) {
    this.serviceContext = ForwardService.name;
  }

  public async setExtensionForward(data: ExtensionStatusData) {
    try {
      return await this.mongo.mongoRequest({ data, entity: CollectionType.forward, requestType: DbRequestType.insert });
    } catch (e) {
      throw e;
    }
  }

  public async getChangeBackExtensionForward(day?: string) {
    try {
      const criteria = {
        dateTo: day || moment().format('DD.MM.YYYY').toString(),
        change: { $exists: true, $ne: true },
      };
      return await this.mongo.mongoRequest<Forward[]>({ criteria, entity: CollectionType.forward, requestType: DbRequestType.findAll });
    } catch (e) {
      throw e;
    }
  }

  public async getSetExtensionForward(day?: string) {
    try {
      const criteria = {
        dateFrom: day || moment().format('DD.MM.YYYY').toString(),
        change: { $exists: true, $ne: true },
      };
      return await this.mongo.mongoRequest<Forward[]>({ criteria, entity: CollectionType.forward, requestType: DbRequestType.findAll });
    } catch (e) {
      throw e;
    }
  }
}
