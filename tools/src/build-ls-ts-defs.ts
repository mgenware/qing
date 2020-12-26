import { promises as fsPromises } from 'fs';
import { webPath } from './paths';

(async () => {
  const lsString = await fsPromises.readFile(webPath('/langs/en.json'), 'utf8');
  const lsObj = JSON.parse(lsString);
  let out = 'export default interface LSDefs {\n';
  for (const key of Object.keys(lsObj)) {
    out += `  ${key}: string;\n`;
  }
  out += '}\n';
  await fsPromises.writeFile(webPath('/src/lsDefs.ts'), out);
})();
