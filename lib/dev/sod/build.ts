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

type SourceTypeField = 'bool' | 'int' | 'uint64' | 'double' | 'string';
type SourceDict = Record<string, SourceTypeField>;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function goCode(cls: string, pkgName: string, obj: SourceDict): string {
  let members: TypeMember[] = [];
  for (const [k, v] of Object.entries(obj)) {
    members.push({
      name: capitalize(k),
      type: v,
      tag: `\`json:"${k}"\``,
    });
  }
  return copyrightString + `package ${pkgName}\n\n` + genGoType('struct', cls, members);
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
      throw new Error(`Unknown type "${type}"`);
  }
}

function tsCode(cls: string, obj: SourceDict): string {
  let s = `export default interface ${cls} {\n`;
  for (const [k, v] of Object.entries(obj)) {
    s += `  ${k}?: ${sourceTypeFieldToTSType(v)};\n`;
  }
  s += `}\n`;
  return copyrightString + s;
}

function trimJSONExtension(s: string): string {
  return s.substr(0, s.length - '.json'.length);
}

(async () => {
  const fullInput = sodPath(input + '.json');
  const relPath = nodePath.relative(sodPath(), fullInput);
  const relPathWithoutJSONExt = trimJSONExtension(relPath);
  const serverFile = nodePath.join(serverSodPath(), relPathWithoutJSONExt);
  const webFile = nodePath.join(webSodPath(), relPathWithoutJSONExt);
  const typeName = capitalize(nodePath.basename(input));
  const sourceDict = JSON.parse(await mfs.readTextFileAsync(fullInput)) as SourceDict;
  const pkgName = nodePath.basename(nodePath.dirname(fullInput));

  await Promise.all([
    mfs.writeFileAsync(
      trimJSONExtension(serverFile) + '.go',
      goCode(typeName, pkgName, sourceDict),
    ),
    mfs.writeFileAsync(trimJSONExtension(webFile) + '.ts', tsCode(typeName, sourceDict)),
  ]);
})();
