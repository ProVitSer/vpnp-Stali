import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CollectionType } from '../types/type';
import { ExtensionForwardRuleType } from '@app/selenoid/types/types';

@Schema({ collection: CollectionType.forward, versionKey: false })
export class Forward {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'any' })
    objectID: any;

    @Prop({ type: Number, required: true })
    exten: number;

    @Prop({ type: String, required: true, enum: ExtensionForwardRuleType })
    type: string;

    @Prop({ type: Number, required: true })
    number: number;

    @Prop()
    dateFrom: Date;

    @Prop()
    dateTo: Date;

    @Prop({ default: false })
    changeBack: string;

    @Prop({ default: true })
    status: boolean;

    @Prop()
    changed: Date;

    @Prop()
    stamp: Date;
}

export const ForwardSchema = SchemaFactory.createForClass(Forward);

export type ForwardDocument = Forward & Document;