import * as mfs from 'm-fs';
import * as nodepath from 'path';
import goConstGen from 'go-const-gen';
import { webPath, serverPath } from './paths.js';

async function buildWebLSDef(content: string): Promise<void> {
  const lsObj = JSON.parse(content);
  let out = 'export default interface LSDefs {\n';
  for (const key of Object.keys(lsObj)) {
    out += `  ${key}: string;\n`;
  }
  out += '}\n';
  await mfs.writeFileAsync(webPath('src/lsDefs.ts'), out);
}

async function buildServerLSDef(content: string): Promise<void> {
  const result = await goConstGen(JSON.parse(content), {
    packageName: 'localization',
    typeName: 'Dictionary',
    parseFunc: true,
  });

  await mfs.writeFileAsync(serverPath('app/handler/localization/dictionary.go'), result);
}

// When importing `app.ts`, `window.ls` must be present. Test files need to
// import this file to make sure import `app.ts` doesn't break.
async function writeENLangForTesting(content: string): Promise<void> {
  const out = `/* eslint-disable */\n(window as any).ls = ${content}`;
  await mfs.writeFileAsync(webPath('src/debug/d/injectLangEN.ts'), out);
}

async function buildDistJS(name: string, file: string): Promise<void> {
  const content = await mfs.readTextFileAsync(file);
  const out = `window.ls = ${content}`;
  await mfs.writeFileAsync(webPath(`langs/dist/${name}.js`), out);
}

async function buildLangs() {
  const names = (await mfs.subFiles(webPath('langs/data'))).map((s) => nodepath.parse(s).name);
  const files = names.map((s) => webPath(`langs/data/${s}.json`));
  await Promise.all(files.map((f, idx) => buildDistJS(names[idx] as string, f)));
}

const lsString = await mfs.readTextFileAsync(webPath('langs/data/en.json'));
await Promise.all([
  buildWebLSDef(lsString),
  buildServerLSDef(lsString),
  writeENLangForTesting(lsString),
  buildLangs(),
]);
