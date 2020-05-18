// @flow

import fnv1a from 'fnv1a';
import { save as extractorSave } from './extractor';
import type {
  SchemaDefs,
  SchemaDefSelectors,
  RuleEntry,
  CompiledSchemaDefs,
} from './types';

function hash(str: string) {
  let hash = fnv1a(str).toString(16);
  const match = str.match(/[a-zA-Z]/);
  const prepend = (match ? match.pop() : undefined) || 'x';
  return `${prepend}${hash}`;
}

export function compileSelectors(
  selectors: SchemaDefSelectors,
  children: string,
  media: ?string
): {
  [className: string]: RuleEntry,
} {
  let result = {};

  for (let key in selectors) {
    const value = selectors[key];

    switch (typeof value) {
      case 'object':
        // @media
        if (/^@/.test(key)) {
          result = Object.assign(
            result,
            compileSelectors(value, children, key)
          );
        }
        // &:focus
        else {
          const child = key.replace(/&/g, '');
          result = Object.assign(
            result,
            compileSelectors(value, children + child, media)
          );
        }
        continue;

      case 'number':
      case 'string':
        const mediaKey = media || '';
        const className = hash(key + value + children + mediaKey);

        const entry: RuleEntry = {
          // Provide a key id to match selectors setting the same key,
          // for example, when for a given key, two classes apply with both
          // backgroundColor as propery, we can filter out the first one by specificity.
          keyId: hash(key + children + mediaKey),
          key,
          value,
          children,
          media,
        };

        extractorSave(className, entry);

        result[className] = entry;
        continue;
    }
  }

  return result;
}

export function compileSchema(schema: SchemaDefs): CompiledSchemaDefs {
  const result = {};

  for (let key in schema) {
    result[key] = compileSelectors(schema[key], '');
  }

  return result;
}
