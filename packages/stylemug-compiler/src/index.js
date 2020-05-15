export { compileSchema } from './compile';

export { flushAsCss } from './extractor';

export type SchemaMap = {|
  [className: string]: {|
    [keyId: string]: string,
  |},
|};
