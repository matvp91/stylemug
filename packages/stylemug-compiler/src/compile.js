const fnva1 = require('fnv1a');
const extractor = require('./extractor');

function hash(str) {
  let hash = fnva1(str).toString(16);
  const prepend = str.match(/[a-zA-Z]/).pop() || 'x';
  return `${prepend}${hash}`;
}

function compileSelectors(selectors, children, media) {
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
        const className = hash(key + value + children + (media || ''));

        const entry = {
          // Provide a key id to match selectors setting the same key,
          // for example, when for a given key, two classes apply with both
          // backgroundColor as propery, we can filter out the first one by specificity.
          keyId: hash(key + children + media),
          key,
          value,
          children,
          media,
        };

        extractor.save(className, entry);

        result[className] = entry;
        continue;
    }
  }

  return result;
}

function compileSchema(schema) {
  const result = {};

  for (let key in schema) {
    result[key] = compileSelectors(schema[key], '');
  }

  return result;
}

module.exports = {
  compileSchema,
  compileSelectors,
};
