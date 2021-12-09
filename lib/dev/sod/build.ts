/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import nodePath from 'path';
import { genGoType, TypeMember } from 'gen-go-type';
import { copyrightString, sodPath, webSodPath, serverSodPath } from '../common/common.js';

const input = process.argv.slice(2)[0];
if (!input) {
  console.log('No input.');
  process.exit(1);
}

type SourceDict = Record<string, Record<string, string>>;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function goCode(pkgName: string, dict: SourceDict): string {
  let s = '';
  let isFirst = true;
  for (const [clsName, fields] of Object.entries(dict)) {
    if (isFirst) {
      isFirst = false;
    } else {
      s += '\n';
    }
    let members: TypeMember[] = [];
    for (const [k, v] of Object.entries(fields)) {
      members.push({
        name: capitalize(k),
        type: v,
        tag: `\`json:"${k}"\``,
      });
    }
    s += genGoType('struct', clsName, members);
  }
  return copyrightString + `package ${pkgName}\n\n` + s;
}

function sourceTypeFieldToTSType(type: string): string {
  switch (type) {
    case 'bool':
      return 'boolean';
    case 'int':
    case 'uint64':
    case 'double':
      return 'number';
    case 'string':
      return 'string';
    default:
      return type;
  }
}

function tsCode(dict: SourceDict): string {
  let s = '';
  let isFirst = true;
  for (const [clsName, fields] of Object.entries(dict)) {
    if (isFirst) {
      isFirst = false;
    } else {
      s += '\n';
    }
    s += `export interface ${clsName} {\n`;
    for (const [k, v] of Object.entries(fields)) {
      s += `  ${k}?: ${sourceTypeFieldToTSType(v)};\n`;
    }
    s += `}\n`;
  }
  return copyrightString + s;
}

function trimJSONExtension(s: string): string {
  return s.substr(0, s.length - '.json'.length);
}

function print(s: string) {
  console.log(s);
}

(async () => {
  try {
    const fullInput = sodPath(input + '.json');
    const relPath = nodePath.relative(sodPath(), fullInput);
    const relPathWithoutJSONExt = trimJSONExtension(relPath);
    const pkgName = nodePath.basename(input);
    const webFile = nodePath.join(webSodPath(), relPathWithoutJSONExt) + '.ts';

    // NOTE: Unlike .ts file, .go files are put in an extra folder named the same as the extracted package name
    const serverFile = nodePath.join(serverSodPath(), relPathWithoutJSONExt, pkgName) + '.go';
    const rawSource = JSON.parse(await mfs.readTextFileAsync(fullInput));
    if (typeof rawSource !== 'object' || Array.isArray(rawSource)) {
      throw new Error(`Source JSON must be an object. Got ${JSON.stringify(rawSource)}`);
    }
    const srcDict = rawSource as SourceDict;

    await Promise.all([
      mfs.writeFileAsync(serverFile, goCode(pkgName, srcDict)),
      mfs.writeFileAsync(webFile, tsCode(srcDict)),
    ]);
    print(`Files written:`);
    print(serverFile);
    print(webFile);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
