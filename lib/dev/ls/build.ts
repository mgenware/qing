/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { goConstGenCore, PropData } from 'go-const-gen';
import * as mfs from 'm-fs';
import * as np from 'path';
import * as qdu from '@qing/devutil';
import { stringHash } from '../cm/checksum.js';
import { deleteAsync } from 'del';
import isProd from '../cm/isProd.js';

const codeWarning = '/* Automatically generated. Do not edit. */\n\n';
const commonHeader = `${qdu.copyrightString}${codeWarning}`;
const webOutBaseDir = qdu.webPath('../userland/static/g/lang');
const args = process.argv.slice(2);
const arg0 = args[0];
const arg1 = args[1];

function print(s: string) {
  // eslint-disable-next-line no-console
  console.log(s);
}

function error(s: string) {
  print(s);
  process.exit(1);
}

// Builds TypeScript definitions for web.
async function buildWebLSDef(lsObj: Record<string, string>, subdir: string): Promise<void> {
  const typeName = `${subdir}LSType`;
  let code = `${commonHeader}/* eslint-disable */\n\nexport interface ${typeName} {\n`;
  for (const key of Object.keys(lsObj)) {
    code += `  ${key}: string;\n`;
  }
  code += '}\n\n';

  code += `declare global {
    var ${subdir}LS: ${typeName};
}\n`;

  const outFile = np.join(qdu.webSrcTypesPath(), 'lang', `${subdir}.d.ts`);
  print(`Building web LS def "${outFile}"`);
  await mfs.writeFileAsync(outFile, code);
}

// TODO: uncomment this after UT compiling issues are resolved.
// Updates the `en.ts` which is used in unit tests.
// async function buildDefaultUTLang(json: string) {
//   const code = `${commonHeader}/* eslint-disable */\n(window as any).ls = ${json}\n`;
//   const outFile = qdu.webPath('src/dev/en.ts');
//   print(`Building web UT lang "${outFile}"`);
//   await mfs.writeFileAsync(outFile, code);
// }

// Builds Go definitions for server.
async function buildServerLSDef(lsObj: Record<string, string>): Promise<PropData[]> {
  const [result, props] = goConstGenCore(lsObj, {
    packageName: 'localization',
    typeName: 'Dictionary',
    parseFunc: true,
  });

  const outFile = qdu.serverPath('a/handler/localization/dictionary.go');
  print(`Building server LS def "${outFile}"`);
  await mfs.writeFileAsync(outFile, qdu.copyrightString + result);
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
  const outFile = qdu.serverPath('a/handler/localization/test_dictionary.go');
  print(`Building server UI lang "${outFile}"`);
  await mfs.writeFileAsync(outFile, res);
}

async function buildJS(
  langName: string,
  srcDir: string,
  outDir: string,
  subdir: string,
): Promise<void> {
  const langFileName = `${langName}.json`;
  const srcFile = np.join(srcDir, langFileName);
  const content = await mfs.readTextFileAsync(srcFile);
  // Parse and stringify the file content to make sure it's valid JSON.
  const outContent = `window.${subdir}LS = ${JSON.stringify(JSON.parse(content))}`;
  const hash = isProd ? stringHash(outContent).substring(0, 8) : '0000';
  const outFile = np.join(outDir, `${langName}-${hash}.js`);
  print(`Building dist JS "${outFile}"`);
  await mfs.writeFileAsync(outFile, outContent);
}

async function buildLangJSFiles(srcDir: string, destDir: string, subdir: string) {
  const names = await qdu.langNamesAsync();
  await Promise.all(names.map((name) => buildJS(name, srcDir, destDir, subdir)));
}

async function buildWeb(subdir: string) {
  // Clean web dist dir.
  const outDir = np.join(webOutBaseDir, subdir);
  await deleteAsync(outDir, { force: true });

  const srcDir = np.join(qdu.webLangDir, subdir);
  const enJSON = await mfs.readTextFileAsync(np.join(srcDir, qdu.defaultLangFile));
  const enObj = JSON.parse(enJSON) as Record<string, string>;
  return Promise.all([buildWebLSDef(enObj, subdir), buildLangJSFiles(srcDir, outDir, subdir)]);
}

async function buildServer() {
  const lsJSON = await mfs.readTextFileAsync(qdu.defaultServerLangFile);
  const lsObj = JSON.parse(lsJSON) as Record<string, string>;
  await buildServerDictFiles(lsObj);
}

if (arg0 === 's') {
  await buildServer();
} else if (arg0 === 'w') {
  if (!arg1) {
    error('Missing subdir param for w mode.');
  }
  await buildWeb(arg1!);
} else if (arg0 === 'w-all') {
  // Build all web folders. This runs alongside pnpm.
  // Web folders have dist files that must be updated locally when new strings are added.
  // Server folder doesn't need this as server generated files are go code and not git ignored.
  const subDirs = await mfs.subDirs(webOutBaseDir);
  await Promise.all(subDirs.map((dir) => buildWeb(dir)));
} else {
  error(`Unknown mode "${arg0}"`);
}
