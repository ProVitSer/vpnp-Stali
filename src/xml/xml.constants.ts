import { ParserOptions, processors } from 'xml2js';

export const SPECIALSYMBOLS: string[] = ['#', '@'];

export const FINALIZE_XML_OPTIONS = {
  pretty: true,
  allowEmpty: false,
};

export const CREATE_XML_OPTIONS = {
  separateArrayItems: true,
};

export const XML_TOO_OBJECT_OPTIONS: ParserOptions = {
  attrNameProcessors: [processors.stripPrefix],
  tagNameProcessors: [processors.stripPrefix],
  explicitArray: false,
  mergeAttrs: true,
  normalize: true,
  normalizeTags: false,
  explicitCharkey: true,
  charkey: 'name',
};
