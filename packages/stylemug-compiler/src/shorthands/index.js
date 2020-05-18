import { circularParser, borderParser, flexParser } from './propertyParsers';

const Expanders = {
  padding: circularParser((key) => `padding${key}`),
  margin: circularParser((key) => `margin${key}`),
  borderWidth: circularParser((key) => `border${key}Width`),
  borderColor: circularParser((key) => `border${key}Color`),
  borderStyle: circularParser((key) => `border${key}Style`),
  borderLeft: borderParser((key) => `borderLeft${key}`),
  borderTop: borderParser((key) => `borderTop${key}`),
  borderRight: borderParser((key) => `borderRight${key}`),
  borderBottom: borderParser((key) => `borderBottom${key}`),
  outline: borderParser((key) => `outline${key}`),
  flex: flexParser(),
};

function expandProperty(property, value) {
  if (property === 'border') {
    const longhands = borderParser((key) => `border${key}`)(value);

    var result = {};
    for (let property in longhands) {
      Object.assign(result, expandProperty(property, longhands[property]));
    }

    return result;
  }

  if (Expanders[property]) {
    const parse = Expanders[property];
    return parse(value);
  }
}

export function extractShorthands(rules) {
  const priority = [
    'borderLeft',
    'borderRight',
    'borderBottom',
    'borderTop',
    'borderWidth',
    'borderStyle',
    'borderColor',
  ];

  const sortedKeys = Object.keys(rules)
    .sort((a, b) =>
      priority.indexOf(a) && priority.indexOf(b)
        ? priority.indexOf(a) > priority.indexOf(b)
        : a > b || -1
    )
    .reverse();

  for (let key of sortedKeys) {
    const value = rules[key];

    if (
      value === null ||
      (typeof value !== 'string' && typeof value !== 'number')
    ) {
      continue;
    }

    // Figure out if we have an expansion for a given rule.
    const expansion = expandProperty(key, value);
    if (!expansion) {
      continue;
    }

    // If we have a rule defined for our expansion, use that value
    // instead.
    // {
    //   margin: '1px 2px', // expands
    //   marginTop: '5px', // use defined value instead.
    // }
    for (let key in expansion) {
      if (rules.hasOwnProperty(key)) {
        expansion[key] = rules[key];
      }
    }

    Object.assign(rules, expansion);

    // Remove the key, it has been replaced with expanded rules.
    delete rules[key];
  }

  return rules;
}
