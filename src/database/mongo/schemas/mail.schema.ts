import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CollectionType } from '../types/type';
import * as mongoose from 'mongoose';

@Schema({ collection: CollectionType.mail, versionKey: false })
export class Mail {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'any' })
    objectID: any;

    @Prop({ type: String })
    from: string;

    @Prop({ type: String })
    to: string;

    @Prop()
    dateFrom: string;

    @Prop()
    dateTo: string;

    @Prop({ default: true })
    status: boolean;

    @Prop({ default: false })
    changeBack: string;

    @Prop()
    changed: Date;

    @Prop()
    stamp: Date;
}

export const MailSchema = SchemaFactory.createForClass(Mail);

export type MailDocument = Mail & Document;