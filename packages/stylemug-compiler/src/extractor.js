let cache = {};

function hyphenate(str) {
  return str.replace(/[A-Z]|^ms/g, '-$&').toLowerCase();
}

export function save(className, rule) {
  if (cache[className]) {
    return;
  }
  cache[className] = rule;
}

export function createRule(className, { key, value, children, media }) {
  const selector = `.${className}${children}`;
  const rule = `${selector}{${hyphenate(key)}:${value}}`;
  return !media ? rule : `${media}{${rule}}`;
}

export function extractCss(clearCache = false) {
  const rules = [];
  for (let className in cache) {
    if (typeof cache[className] === 'string') {
      rules.push(`.${className}{${cache[className]}}`);
    } else {
      rules.push(createRule(className, cache[className]));
    }
  }
  if (clearCache) {
    cache = {};
  }
  return rules.join('');
}
