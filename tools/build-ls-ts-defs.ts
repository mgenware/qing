// Build type definitions for `src/ls.ts`.

import { promises as fsPromises } from 'fs';

(async () => {
  const lsString = await fsPromises.readFile('./langs/en.json', 'utf8');
  const lsObj = JSON.parse(lsString);
  let out = `export default interface LSDefs {\n`;
  for (const key of Object.keys(lsObj)) {
    out += `  ${key}: string;\n`;
  }
  out += '}\n';
  await fsPromises.writeFile('./src/lsDefs.ts', out);
})();
