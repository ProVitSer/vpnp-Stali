import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MongoAdapter } from './mongo.adapter';
import { DBResultError, DBResultSuccess } from './mongo.provider';
import { MongoRequestParamsInterface, MongoApiResultInterface, PlainObject } from './types/interfaces';
import { DbRequestType } from './types/type';

@Injectable()
export class MongoService {

    constructor(@InjectConnection() private readonly connection: Connection) { }

    public async mongoRequest<T>(params: MongoRequestParamsInterface): Promise<T> {
        try {
            const { model, criteria, requestType, options, data } = new MongoAdapter(params, this.connection);
            const resultData =  await this[this.getMethodByActionType(requestType)]({ model, criteria, options, data });
            return this.provideDatabaseRequestResult(new DBResultSuccess(requestType, params.entity, data, resultData ));
        } catch (e) {
            return this.provideDatabaseRequestResult(new DBResultError(params.requestType, params.entity, e));
        }
    }

    private getMethodByActionType(requestType: DbRequestType): string {
        switch (requestType) {
            case DbRequestType.findAll:
                return 'getList';
            case DbRequestType.findById:
                return 'getDocumentById';
            case DbRequestType.updateOne:
                return 'updateOne';
            case DbRequestType.insert:
                return 'insert';
            case DbRequestType.deleteDocumentById:
                return 'deleteDocumentById';
            case DbRequestType.delete:
                return 'delete';
            case DbRequestType.deleteMany:
                return 'deleteCollection';
            case DbRequestType.insertMany:
                return 'insertMany';
        }
    }

    private async getList({ model, criteria, projection }): Promise<any | undefined> {
        try{
            return await model.find(criteria, projection);
        }catch(e){
            throw e
        }
    }

    private async getDocumentById({ model, criteria }): Promise<any | undefined> {
        try{
            return await model.findById(criteria.id);
        }catch(e){
            throw e
        }
    }

    private async updateOne({ model, criteria, data }): Promise<any | undefined> {
        try{
            return await model.updateOne(criteria, this.formatData(data, DbRequestType.updateOne));
        }catch(e){
            throw e
        }
    }

    private async insert({ model, data }): Promise<any | undefined> {
        try{
            return await new model(this.formatData(data, DbRequestType.insert)).save();
        }catch(e){
            throw e
        }
    }
      
    private async insertMany({ model, data }): Promise<any | undefined> {
        try{
            return await model.insertMany(this.formatData(data, DbRequestType.insert));
        }catch(e){
            throw e
        }
    }

    private async deleteDocumentById({ model, criteria }): Promise<any | undefined> {
        try{
            return await model.deleteOne(criteria.id, this.formatData(criteria, DbRequestType.delete));
        }catch(e){
            throw e
        }
    }

    private async delete({ model, criteria }): Promise<any | undefined> {
        try{
            return await model.deleteOne(criteria, this.formatData(criteria, DbRequestType.delete));
        }catch(e){
            throw e
        }
    }

    private async deleteCollection({ model }): Promise<any | undefined> {
        try{
            return await model.deleteMany({});
        }catch(e){
            throw e
        }
        
    }

    private formatData(data: PlainObject, requestType: DbRequestType): PlainObject {
        return {
            ...data,
            ...this.addAdditionalFields(requestType)
        };
    }


    private addAdditionalFields(requestType: DbRequestType): PlainObject {
        const stamp = new Date();
        const changed = new Date();
        switch (requestType) {
            case DbRequestType.insert:
                return { stamp, changed }; 
            case DbRequestType.updateOne:
                return { changed };
            case DbRequestType.delete: case DbRequestType.deleteDocumentById: case DbRequestType.deleteMany:
                return { stamp };
            default:
                return {};
        }
    }

    protected async provideDatabaseRequestResult(requestResult: MongoApiResultInterface): Promise<any | undefined>{
        if(requestResult.result){
            const { requestType, data, entity, resultData } = requestResult;
            return requestResult.resultData;
        } else {
            throw (requestResult.message instanceof Error ? requestResult.message : new Error(requestResult.message));   
        }
    }


}