import { CollectionType, DbRequestType, LogEventType, SchemaType } from './types/type';
import { MailSchema, Mail, ForwardSchema, Forward } from './schemas';

export const Schemas: SchemaType = {
  [CollectionType.mail]: { schema: MailSchema, class: Mail },
  [CollectionType.forward]: { schema: ForwardSchema, class: Forward },
};
