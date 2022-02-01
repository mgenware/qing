/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { goConstGenCore, PropData } from 'go-const-gen';
import * as mfs from 'm-fs';
import * as path from 'path';
import {
  webPath,
  serverPath,
  copyrightString,
  langNamesAsync,
  langDataPath,
  defaultLangPath,
} from '../common/common.js';

const codeWarning = '/* Automatically generated. Do not edit. */\n\n';
const commonHeader = `${copyrightString}${codeWarning}`;

function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

// Builds TypeScript definitions for web.
async function buildWebLSDef(lsObj: Record<string, string>): Promise<void> {
  let code = `${commonHeader}export default interface LSDefs {\n`;
  for (const key of Object.keys(lsObj)) {
    code += `  ${key}: string;\n`;
  }
  code += '}\n';
  const outFile = webPath('src/lsDefs.ts');
  print(`Building web LS def "${outFile}"`);
  await mfs.writeFileAsync(outFile, code);
}

// Updates the `en.ts` which is used in unit tests.
async function buildDefaultUTLang(json: string) {
  const code = `${commonHeader}/* eslint-disable */\n(window as any).ls = ${json}\n`;
  const outFile = webPath('src/dev/en.ts');
  print(`Building web UT lang "${outFile}"`);
  await mfs.writeFileAsync(outFile, code);
}

// Builds Go definitions for server.
async function buildServerLSDef(lsObj: Record<string, string>): Promise<PropData[]> {
  const [result, props] = goConstGenCore(lsObj, {
    packageName: 'localization',
    typeName: 'Dictionary',
    parseFunc: true,
  });

  const outFile = serverPath('a/handler/localization/dictionary.go');
  print(`Building server LS def "${outFile}"`);
  await mfs.writeFileAsync(outFile, copyrightString + result);
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
  const outFile = serverPath('a/handler/localization/test_dictionary.go');
  print(`Building server UI lang "${outFile}"`);
  await mfs.writeFileAsync(outFile, res);
}

async function buildDistJS(name: string, file: string): Promise<void> {
  const content = await mfs.readTextFileAsync(file);
  const outContent = `window.ls = ${content}`;
  const outDir = webPath('../userland/static/g/lang');
  const outFile = path.join(outDir, `${name}.js`);
  print(`Building dist JS "${outFile}"`);
  await mfs.writeFileAsync(outFile, outContent);
}

async function buildLangs() {
  const names = await langNamesAsync();
  const files = names.map(langDataPath);
  await Promise.all(files.map((f, idx) => buildDistJS(names[idx] as string, f)));
}

const lsJSON = await mfs.readTextFileAsync(defaultLangPath);
const lsObj = JSON.parse(lsJSON) as Record<string, string>;
await Promise.all([
  buildWebLSDef(lsObj),
  buildServerDictFiles(lsObj),
  buildLangs(),
  buildDefaultUTLang(lsJSON),
]);
