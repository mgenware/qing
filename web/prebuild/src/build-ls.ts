/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import * as nodepath from 'path';
import { goConstGenCore, PropData } from 'go-const-gen';
import { webPath, serverPath, copyrightString } from './common.js';

async function buildWebLSDef(content: string): Promise<void> {
  const lsObj = JSON.parse(content);
  let out = 'export default interface LSDefs {\n';
  for (const key of Object.keys(lsObj)) {
    out += `  ${key}: string;\n`;
  }
  out += '}\n';
  await mfs.writeFileAsync(webPath('src/lsDefs.ts'), out);
}

async function buildServerLSDef(content: string): Promise<PropData[]> {
  const [result, props] = await goConstGenCore(JSON.parse(content), {
    packageName: 'localization',
    typeName: 'Dictionary',
    parseFunc: true,
  });

  await mfs.writeFileAsync(
    serverPath('app/handler/localization/dictionary.go'),
    copyrightString + result,
  );
  return props;
}

async function buildServerDictFiles(content: string): Promise<void> {
  const propData = await buildServerLSDef(content);
  let res = copyrightString;
  res += `package localization

// STDict is a Dictionary implementation for server testing.
var STDict *Dictionary
  
func init() {
\tSTDict = &Dictionary{}`;
  for (const prop of propData) {
    res += `\tSTDict.${prop.namePascalCase} = "${prop.name}"\n`;
  }
  res += '}\n\n';
  await mfs.writeFileAsync(serverPath('app/handler/localization/st_dictionary.go'), res);
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
  buildServerDictFiles(lsString),
  writeENLangForTesting(lsString),
  buildLangs(),
]);
