/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import mfs from 'm-fs';
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

function goCode(cls: string, obj: SourceDict): string {
  let members: TypeMember[] = [];
  for (const [k, v] of Object.entries(obj)) {
    members.push({
      name: capitalize(k),
      type: v,
      tag: `\`json:"${k}"\``,
    });
  }
  return copyrightString + genGoType('struct', cls, members);
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
  let s = `export default interface ${cls} {`;
  for (const [k, v] of Object.entries(obj)) {
    s += `  ${k}: ${sourceTypeFieldToTSType(v)}?;\n`;
  }
  s += `}\n`;
  return copyrightString + s;
}

(async () => {
  const fullInput = nodePath.resolve(input);
  const relPath = nodePath.relative(sodPath(), fullInput);
  const serverFile = nodePath.join(serverSodPath(), relPath);
  const webFile = nodePath.join(webSodPath(), relPath);
  const typeName = capitalize(nodePath.basename(input));
  const sourceDict = JSON.parse(await mfs.readTextFileAsync(input)) as SourceDict;
  await Promise.all([
    mfs.writeFileAsync(serverFile, goCode(typeName, sourceDict)),
    mfs.writeFileAsync(webFile, tsCode(typeName, sourceDict)),
  ]);
})();
