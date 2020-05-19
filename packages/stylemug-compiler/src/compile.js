import fnv1a from 'fnv1a';
import { save as extractorSave } from './extractor';
import { extractShorthands } from './shorthands';
import { createContext } from './context';
import { PseudoClasses, PseudoElements } from './static';

function hash(str) {
  let hash = fnv1a(str).toString(16);
  const match = str.match(/[a-zA-Z]/);
  const prepend = (match ? match.pop() : undefined) || 'x';
  return `${prepend}${hash}`;
}

export function compileSelectors(selectors, children, media, context) {
  let result = {};

  selectors = extractShorthands(selectors);

  for (let key in selectors) {
    const value = selectors[key];

    switch (typeof value) {
      default:
        context.report('Invalid type for ' + key);
        continue;

      case 'object':
        // @media
        if (/^@/.test(key)) {
          result = Object.assign(
            result,
            compileSelectors(value, children, key, context)
          );
        }
        // &:focus
        else {
          const child = key.replace(/&/g, '');

          if (
            !PseudoClasses.includes(child) &&
            !PseudoElements.includes(child)
          ) {
            context.report(key + ' is an invalid CSS pseudo class / element');
          }

          result = Object.assign(
            result,
            compileSelectors(value, children + child, media, context)
          );
        }
        continue;

      case 'number':
      case 'string':
        const mediaKey = media || '';
        const className = hash(key + value + children + mediaKey);

        const entry = {
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

export function compileSchema(schema) {
  const result = {};
  const context = createContext();

  for (let key in schema) {
    if (typeof schema[key] !== 'object') {
      context.report('Classname with key ' + key + ' is not an object');
      continue;
    }

    result[key] = compileSelectors(schema[key], '', undefined, context);
  }

  return { result, reports: context.getReports() };
}
