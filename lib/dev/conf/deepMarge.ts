import isPlainObject from 'is-plain-obj';

// https://stackoverflow.com/a/34749873
export function mergeDeep(target: unknown, ...sources: unknown[]) {
  if (!sources.length) {
    return;
  }
  const source = sources.shift();

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  mergeDeep(target, ...sources);
}
