import { LoggerService } from '@app/logger/logger.service';
import { SelenoidProvider } from '@app/selenoid/selenoid.provider';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { format } from 'date-fns';
import { ExtensionForwardRuleType, ServicesType } from '../interfaces/additional-services.enum';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { AdditionalServicesModel } from '../additional-services.model';
import { ServicesTypeToActionTypeMap } from '../interfaces/additional-services.interface';
import { SelenoidDataTypes } from '@app/selenoid/interfaces/selenoid.interface';
import * as PromiseBluebird from 'bluebird';
import { DATE_FORMAT, DEFERRED_PBX_SET_FROWARD_TIME, REVERT_PBX_SET_FROWARD_TIME } from '@app/config/app.config';
import { AdditionalModelService } from '../services';
import { AdditionalServicesService } from '../additional-services.service';
import { UtilsService } from '@app/utils/utils.service';

@Injectable()
export class ChangeForwardScheduleService {
    private serviceContext: string;

    constructor(
        private readonly additionalModelService: AdditionalModelService,
        private readonly logger: LoggerService,
        private readonly selenoid: SelenoidProvider,
        private readonly additionalServicesService: AdditionalServicesService
    ) {
        this.serviceContext = ChangeForwardScheduleService.name;
    }

    @Cron(DEFERRED_PBX_SET_FROWARD_TIME)
    async setForward() {
        if (!process.env.NODE_APP_INSTANCE || Number(process.env.NODE_APP_INSTANCE) === 0) {

            try {

                const result = await this.additionalModelService.findByCriteria({
                    service: { $in: [ServicesType.mail, ServicesType.extension] },
                    revertChange: { $exists: true, $ne: true },
                    dateFrom: format(new Date(), DATE_FORMAT),
                });

                if (result.length === 0) return;

                await this.change(result);

            } catch (e) {

                this.logger.error(e, this.serviceContext);

            }
        }
    }

    @Cron(REVERT_PBX_SET_FROWARD_TIME)
    async revertForward() {
        if (!process.env.NODE_APP_INSTANCE || Number(process.env.NODE_APP_INSTANCE) === 0) {

            try {

                const result = await this.additionalModelService.findByCriteria({
                    service: { $in: [ServicesType.mail, ServicesType.extension] },
                    revertChange: { $exists: true, $ne: true },
                    dateTo: format(new Date(), DATE_FORMAT),
                });

                if (result.length === 0) return;

                const revertData = this.revertStatus(result);

                await this.change(revertData);

            } catch (e) {

                this.logger.error(e, this.serviceContext);

            }
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


                    if(a.service == ServicesType.mail){

                        await this.selenoid.action(ServicesTypeToActionTypeMap[a.service], { ...this.getForwardData(a) });

                    } else {

                        await this.updateExtensionStatus(a);
                    }


                    if (!a.status) await this.additionalModelService.updateById(a._id, { revertChange: true });

                },
                { concurrency: 1 },
            );

        } catch (e) {

            throw e;

        }
    }

    private async updateExtensionStatus(data: DocumentType<AdditionalServicesModel>){

        const addData = {  exten: data.exten, type: data.type as unknown as ExtensionForwardRuleType, number: data.number, dateFrom: data.dateFrom, dateTo: data.dateTo, status: data.status };

        if (UtilsService.isDateNow(addData.dateFrom)) {

            if(data.status){

                await this.additionalServicesService.setExtensionCallForwardStatus(addData);

            }else{

                await this.additionalServicesService.setExtensionForwardAvailable(addData.number);

            }
            
        }

        if (UtilsService.isDateNow(addData.dateTo)) {

            if(data.status){

                await this.additionalServicesService.setExtensionCallForwardStatus(addData);

            }else{

                await this.additionalServicesService.setExtensionForwardAvailable(addData.number);

            }
        }

    }

    private getForwardData(data: DocumentType<AdditionalServicesModel>): SelenoidDataTypes {

        let forwardData = {};
        
        switch (data.service) {
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
