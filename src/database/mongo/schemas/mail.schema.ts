import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CollectionType } from '../types/type';
import * as mongoose from 'mongoose';

@Schema({ collection: CollectionType.mail, versionKey: false })
export class Mail {
    _id: string

    @Prop({ type: String })
    from: string;

    @Prop({ type: String })
    to: string;

    @Prop()
    dateFrom: string;

    @Prop()
    dateTo: string;

    @Prop()
    status: string;

    @Prop({ default: false })
    change: boolean;

    @Prop()
    changed: Date;

    @Prop()
    stamp: Date;
}

export const MailSchema = SchemaFactory.createForClass(Mail);

export type MailDocument = Mail & Document;