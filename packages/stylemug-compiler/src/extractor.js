let cache = {};

function hyphenate(str) {
  return str.replace(/[A-Z]|^ms/g, '-$&').toLowerCase();
}

function clear() {
  cache = {};
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

export function flushAsCss() {
  const rules = [];
  for (let className in cache) {
    rules.push(createRule(className, cache[className]));
  }
  clear();
  return rules.join('');
}
