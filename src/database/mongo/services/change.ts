import { Injectable } from "@nestjs/common";
import { MongoService } from "../mongo.service";
import { Mail } from "../schemas";
import { ChangeBackData, UpdateDataStruct } from "../types/interfaces";
import { CollectionType, DbRequestType } from "../types/type";
import { ForwardService } from "./forward.service";
import { MailService } from "./mail.service";

@Injectable()
export class Change {
    private serviceContext: string;

    constructor(
        private readonly mongo: MongoService,  
        private readonly mail: MailService,
        private readonly forward: ForwardService
    ){
        this.serviceContext = Change.name;
    }

    public async getChangeBackData(): Promise<ChangeBackData[]> {
        try {
            const mail = {
                type: CollectionType.mail,
                data: await this.mail.getChangeBackMailForward()
            };
            const forward = {
                type: CollectionType.forward,
                data: await this.forward.getChangeBackExtensionForward()
            }
            return [mail, forward]
        }catch(e){
            throw e;
        }
    }

    public async getSetForwardData(): Promise<ChangeBackData[]> {
        try {
            const mail = {
                type: CollectionType.mail,
                data: await this.mail.getSetMailForward()
            };
            const forward = {
                type: CollectionType.forward,
                data: await this.forward.getSetExtensionForward()
            }
            return [mail, forward]
        }catch(e){
            throw e;
        }
    }

    public async setUpdate(updateData: UpdateDataStruct){
        try {
            return await this.mongo.mongoRequest({criteria: { _id: updateData.id }, data: { ...updateData.field }, entity: updateData.type, requestType: DbRequestType.updateOne});
        }catch(e){
            throw e;
        }
    }
}