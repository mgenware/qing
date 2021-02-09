import { promises as fsPromises } from 'fs';
import { webPath } from './paths.js';

async function writeLSDef(content: string): Promise<void> {
  const lsObj = JSON.parse(content);
  let out = 'export default interface LSDefs {\n';
  for (const key of Object.keys(lsObj)) {
    out += `  ${key}: string;\n`;
  }
  out += '}\n';
  await fsPromises.writeFile(webPath('/src/lsDefs.ts'), out);
}

// When importing `app.ts`, `window.ls` must be present. Test files need to
// import this file to make sure import `app.ts` doesn't break.
async function writeENLangForTesting(content: string): Promise<void> {
  const out = `/* eslint-disable */\n(window as any).ls = ${content}`;
  await fsPromises.writeFile(webPath('/src/debug/d/injectLangEN.ts'), out);
}

(async () => {
  const lsString = await fsPromises.readFile(webPath('/langs/en.json'), 'utf8');
  await Promise.all([writeLSDef(lsString), writeENLangForTesting(lsString)]);
})();
