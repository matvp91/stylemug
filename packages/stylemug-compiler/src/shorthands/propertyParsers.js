const isUnit = (val) =>
  val.match(
    /(em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|q|in|pt|pc|px|dpi|dpcm|dppx|%|auto)$/i
  ) !== null ||
  val.match(/^(calc\()/i) !== null ||
  val.match(/^(var\()/i) !== null;

const createParser = (parseFn) => (resolve) => (value) => {
  const values = [];
  let temp = '';
  let bracketsCount = 0;

  const trim = value.toString().trim();
  const len = trim.length;

  for (let i = 0; i < len; i += 1) {
    const char = trim.charAt(i);
    const inBrackets = bracketsCount > 0;

    if (!inBrackets && char === ' ') {
      values.push(temp);
      temp = '';
    } else {
      temp += char;
    }

    // Detect whether we are in brackets or not.
    bracketsCount +=
      {
        '(': 1,
        ')': -1,
      }[char] || 0;
  }

  if (temp) {
    values.push(temp);
  }

  return parseFn(values, resolve);
};

export const borderParser = createParser((values, resolve) => {
  const BORDER_STYLE = /^(dashed|dotted|double|groove|hidden|inset|none|outset|ridge|solid)$/i;
  const BORDER_WIDTH = /^(thick|medium|think)$/i;

  const longhands = {};

  values.forEach((value) => {
    if (value.match(BORDER_STYLE) !== null) {
      longhands[resolve('Style')] = value;
    } else if (
      isUnit(value) ||
      value.match(BORDER_WIDTH) !== null ||
      value === '0'
    ) {
      longhands[resolve('Width')] = value;
    } else {
      longhands[resolve('Color')] = value;
    }
  });

  return longhands;
});

export const circularParser = createParser((values, resolve) => {
  const longhands = {};

  longhands[resolve('Top')] = values[0];
  longhands[resolve('Right')] = values[1] || values[0];
  longhands[resolve('Bottom')] = values[2] || values[0];
  longhands[resolve('Left')] = values[3] || values[1] || values[0];

  return longhands;
});

export const flexParser = createParser((values) => {
  const longhands = {};

  values.forEach((value) => {
    if (isUnit(value)) {
      longhands.flexBasis = value;
    } else {
      if (longhands.flexGrow) {
        longhands.flexShrink = value;
      } else {
        longhands.flexGrow = value;
      }
    }
  });

  return longhands;
});
