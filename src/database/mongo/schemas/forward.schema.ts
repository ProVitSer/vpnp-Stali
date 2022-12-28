import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CollectionType } from '../types/type';
import { ExtensionForwardRuleType } from '@app/selenoid/interfaces/types';

@Schema({ collection: CollectionType.forward, versionKey: false })
export class Forward {
  _id: string;

  @Prop({ type: String, required: true })
  exten: string;

  @Prop({ type: String, required: true, enum: ExtensionForwardRuleType })
  type: ExtensionForwardRuleType;

  @Prop({ type: String, required: true })
  number: string;

  @Prop()
  dateFrom: string;

  @Prop()
  dateTo: string;

  @Prop({ default: false })
  change: string;

  @Prop({ default: 'true' })
  status: string;

  @Prop()
  changed: Date;

  @Prop()
  stamp: Date;
}

export const ForwardSchema = SchemaFactory.createForClass(Forward);

export type ForwardDocument = Forward & Document;
