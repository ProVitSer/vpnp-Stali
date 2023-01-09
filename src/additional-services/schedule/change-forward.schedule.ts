import { LoggerService } from '@app/logger/logger.service';
import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdditionalServicesModelService } from '../additional-services.service';
import { format } from 'date-fns';
import { ServicesType } from '../interfaces/additional-services.enum';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { AdditionalServicesModel } from '../additional-services..model';
import { ServicesTypeToActionTypeMap } from '../interfaces/additional-services.interface';
import { ForwardRuleType, SelenoidDataTypes } from '@app/selenoid/interfaces/selenoid.interface';
import * as PromiseBluebird from 'bluebird';

@Injectable()
export class ChangeForwardScheduleService {
  private serviceContext: string;

  constructor(
    private readonly additionalServicesModel: AdditionalServicesModelService,
    private readonly logger: LoggerService,
    private readonly selenoid: SelenoidProvider,
  ) {
    this.serviceContext = ChangeForwardScheduleService.name;
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async setForward() {
    try {
      const result = await this.additionalServicesModel.findByCriteria({
        service: { $in: [ServicesType.mail, ServicesType.extension] },
        revertChange: { $exists: true, $ne: true },
        dateFrom: format(new Date(), 'dd.MM.yyyy'),
      });
      if (result.length === 0) return;
      await this.change(result);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async revertForward() {
    try {
      const result = await this.additionalServicesModel.findByCriteria({
        service: { $in: [ServicesType.mail, ServicesType.extension] },
        revertChange: { $exists: true, $ne: true },
        dateTo: format(new Date(), 'dd.MM.yyyy'),
      });
      if (result.length === 0) return;
      const revertData = this.revertStatus(result);
      await this.change(revertData);
    } catch (e) {
      this.logger.error(e, this.serviceContext);
    }
  }

  private revertStatus(data: DocumentType<AdditionalServicesModel>[]): DocumentType<AdditionalServicesModel>[] {
    return data.map((a: DocumentType<AdditionalServicesModel>) => {
      a.status = !a.status;
      return a;
    });
  }
  private async change(data: DocumentType<AdditionalServicesModel>[]): Promise<void> {
    try {
      await PromiseBluebird.map(
        data,
        async (a: DocumentType<AdditionalServicesModel>) => {
          await this.selenoid.change(ServicesTypeToActionTypeMap[a.service], { ...this.getForwardData(a) });
          if (!a.status) await this.additionalServicesModel.updateById(a._id, { revertChange: true });
        },
        { concurrency: 1 },
      );
    } catch (e) {
      throw e;
    }
  }

  private getForwardData(data: DocumentType<AdditionalServicesModel>): SelenoidDataTypes {
    let forwardData = {};
    switch (data.service) {
      case ServicesType.extension:
        forwardData = {
          exten: data.exten,
          type: data.type as unknown as ForwardRuleType,
          number: data.number,
        };
        break;
      case ServicesType.mail:
        forwardData = {
          from: data.from,
          to: data.to,
        };
        break;
      default:
        break;
    }

    return { ...forwardData, dateFrom: data.dateFrom, dateTo: data.dateTo, status: data.status } as SelenoidDataTypes;
  }
}
