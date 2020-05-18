export type SchemaMap = {|
  [id: string]: {
    [keyId: string]: /* className */ string,
  },
|};

export type RuleEntry = {|
  keyId: string,
  key: string,
  value: string,
  children: string,
  media: ?string,
|};

export type SchemaDefSelectors = {
  [propName: string]:
    | string
    | number
    | /* pseudoSelector */ {
        [pseudoPropName: string]: string | number,
      },
};

export type SchemaDefs = {|
  [id: string]: SchemaDefSelectors,
|};

export type CompiledSchemaDefs = {|
  [id: string]: {
    [classNameHash: string]: RuleEntry,
  },
|};
