let cache = {};

function save(className, rule) {
  if (cache[className]) {
    return;
  }
  cache[className] = rule;
}

function hyphenate(str) {
  return str.replace(/[A-Z]|^ms/g, '-$&').toLowerCase();
}

function createRule(className, { key, value, children, media }) {
  const selector = `.${className}${children}`;
  const rule = `${selector}{${hyphenate(key)}:${value}}`;
  return !media ? rule : `${media}{${rule}}`;
}

function flushAsCss() {
  const rules = [];
  for (let className in cache) {
    rules.push(createRule(className, cache[className]));
  }
  return rules.join('');
}

module.exports = {
  save,
  flushAsCss,
};
