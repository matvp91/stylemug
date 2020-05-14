const warnings = {};

export default function warn(str) {
  if (warnings[warn]) {
    return;
  }
  warnings[warn] = true;
  console.warn('[stylemug] ' + str);
}
