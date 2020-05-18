export function expandShorthand(key, value) {
  const values = value.split(' ');

  const def = Shorthands[key];
  if (!def) {
    return null;
  }

  const defaults = Object.values(def);
  return Object.keys(def).reduce((obj, key, i) => {
    obj[key] = values[i] || defaults[i];
    return obj;
  }, {});
}
