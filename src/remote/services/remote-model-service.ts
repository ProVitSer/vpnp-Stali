import { Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { RemoteModel } from '../remote.model';

@Injectable()
export class RemoteModelService {
  constructor(@InjectModel(RemoteModel) private readonly remoteModel: ModelType<RemoteModel>) {}

  public async create(data: { [key: string]: any }): Promise<DocumentType<RemoteModel>> {
    return this.remoteModel.create(data);
  }

  public async updateById(id: string | Types.ObjectId, data: { [key: string]: any }) {
    return await this.remoteModel.findByIdAndUpdate(id, { ...data }, { new: true }).exec();
  }

  public async findById(id: string) {
    return this.remoteModel.findById(id).exec();
  }

  public async deleteById(id: string) {
    return await this.remoteModel.findByIdAndRemove(id).exec();
  }

  public async findByCriteria(criteria: { [key: string]: any }): Promise<DocumentType<RemoteModel>[]> {
    return await this.remoteModel.find(criteria).exec();
  }
}
