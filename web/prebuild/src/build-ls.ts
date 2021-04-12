/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import { goConstGenCore, PropData } from 'go-const-gen';
import {
  webPath,
  serverPath,
  copyrightString,
  langNamesAsync,
  langDataPath,
  defaultLangPath,
  langsDir,
} from './common.js';

const codeWarning = '/* Automatically generated. Do not edit. */\n\n';
const commonHeader = `${copyrightString}${codeWarning}`;

async function buildWebLSDef(lsObj: Record<string, string>): Promise<void> {
  let out = `${commonHeader}export default interface LSDefs {\n`;
  for (const key of Object.keys(lsObj)) {
    out += `  ${key}: string;\n`;
  }
  out += '}\n';
  await mfs.writeFileAsync(webPath('src/lsDefs.ts'), out);
}

async function buildServerLSDef(lsObj: Record<string, string>): Promise<PropData[]> {
  const [result, props] = await goConstGenCore(lsObj, {
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

async function buildServerDictFiles(lsObj: Record<string, string>): Promise<void> {
  const propData = await buildServerLSDef(lsObj);
  let res = `${commonHeader}package localization

// TestDict is a Dictionary implementation for server testing.
var TestDict *Dictionary
  
func init() {
\tTestDict = &Dictionary{}\n`;
  for (const prop of propData) {
    res += `\tTestDict.${prop.namePascalCase} = "ls.${prop.name}"\n`;
  }
  res += '}\n';
  await mfs.writeFileAsync(serverPath('app/handler/localization/test_dictionary.go'), res);
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
  await mfs.writeFileAsync(webPath(`${langsDir}/dist/${name}.js`), out);
}

async function buildLangs() {
  const names = await langNamesAsync();
  const files = names.map(langDataPath);
  await Promise.all(files.map((f, idx) => buildDistJS(names[idx] as string, f)));
}

const lsString = await mfs.readTextFileAsync(defaultLangPath);
const lsObj = JSON.parse(lsString) as Record<string, string>;
await Promise.all([
  buildWebLSDef(lsObj),
  buildServerDictFiles(lsObj),
  writeENLangForTesting(lsString),
  buildLangs(),
]);
