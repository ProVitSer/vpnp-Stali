import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { AdditionalServicesModel } from '../additional-services.model';

@Injectable()
export class AdditionalModelService {
  constructor(@InjectModel(AdditionalServicesModel) private readonly additionalServicesModel: ModelType<AdditionalServicesModel>) {}

  public async create(data: { [key: string]: any }): Promise<DocumentType<AdditionalServicesModel>> {
    return await this.additionalServicesModel.create(data);
  }

  public async updateById(id: string | Types.ObjectId, data: { [key: string]: any }) {
    return await this.additionalServicesModel.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
  }

  public async findById(id: string) {
    return this.additionalServicesModel.findById(id).exec();
  }

  public async findByCriteria(criteria: { [key: string]: any }): Promise<DocumentType<AdditionalServicesModel>[]> {
    return await this.additionalServicesModel.find(criteria).exec();
  }
}
