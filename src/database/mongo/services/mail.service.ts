import * as moment from 'moment';
import { MailForwardData } from "@app/selenoid/types/interfaces";
import { Injectable } from "@nestjs/common";
import { MongoService } from "../mongo.service";
import { CollectionType, DbRequestType } from "../types/type";
import { Mail } from '../schemas';

@Injectable()
export class MailService {
    private serviceContext: string;

    constructor(
        private readonly mongo: MongoService,  
    ){
        this.serviceContext = MailService.name;
    }

    public async setMailForward(data: MailForwardData){
        try{
            const { from, to, dateFrom, dateTo, status} = data
            const requsetInfo = {
                from,
                to,
                dateFrom,
                dateTo,
                status
            };
            return await this.mongo.mongoRequest({data : requsetInfo, entity: CollectionType.mail, requestType: DbRequestType.insert});
        }catch(e){
            throw e;
        }
    }

    public async getChangeBackMailForward(day?: string){
        try{
            const criteria = {
                dateTo: day || moment().format("DD.MM.YYYY").toString(),
                change: { $exists: true, $ne: true}
            };
            return await this.mongo.mongoRequest<Mail[]>({criteria, entity: CollectionType.mail, requestType: DbRequestType.findAll})
        }catch(e){
            throw e;
        }
    }

    public async getSetMailForward(day?: string){
        try{
            const criteria = {
                dateFrom: day || moment().format("DD.MM.YYYY").toString(),
                change: { $exists: true, $ne: true}
            };
            return await this.mongo.mongoRequest<Mail[]>({criteria, entity: CollectionType.mail, requestType: DbRequestType.findAll})
        }catch(e){
            throw e;
        }
    }
}