import { PlainObject } from '@app/soap1c/interfaces/soap1c.interface';
import { Injectable } from '@nestjs/common';
import { create as createXml, CreateOptions } from 'xmlbuilder';
import { Parser, ParserOptions } from 'xml2js';
import { CREATE_XML_OPTIONS, FINALIZE_XML_OPTIONS, SPECIALSYMBOLS, XML_TOO_OBJECT_OPTIONS } from './xml.constants';

@Injectable()
export class XmlService {
  public async createXmlFromObjectAsync(data: PlainObject, options: CreateOptions = {}): Promise<string> {
    return Promise.resolve(createXml(data, { ...CREATE_XML_OPTIONS, ...options }).end(FINALIZE_XML_OPTIONS));
  }

  public async createObjectFromXmlAsync(data: string, options?: ParserOptions): Promise<PlainObject> {
    return await new Parser(options ? options : XML_TOO_OBJECT_OPTIONS).parseStringPromise(data);
  }

  public addNameSpace(data: PlainObject, namespace: string): PlainObject {
    const result = {};
    const renameKeys = (o: PlainObject, r: PlainObject, ns: string) => {
      for (const k in o) {
        if (Object.prototype.hasOwnProperty.call(o, k)) {
          const nKey = Array.isArray(o) || SPECIALSYMBOLS.includes(k?.charAt(0)) ? k : `${ns}:${k}`;
          if (typeof o[k] === 'object') {
            r[nKey] = Array.isArray(o[k]) ? [] : {};
            renameKeys(o[k], r[nKey], ns);
          } else {
            r[nKey] = o[k] === undefined ? 'undefined' : o[k];
          }
        }
      }
    };
    renameKeys(data, result, namespace);
    return result;
  }
}
