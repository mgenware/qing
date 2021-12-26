/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { genGoType, TypeMember, Options } from 'gen-go-type';
import sortedObjEntries from 'sorted-object-entries';
import * as cm from './common.js';

export const goOutDirAttr = '__go_out_dir';
const goCtorAttr = '__go_ctor';
const goExtendsAttr = '__go_extends';
const goRenameAttr = '__go_rename';

cm.addAllowedAttrs([goCtorAttr, goExtendsAttr, goRenameAttr]);

function joinImports(imports: string[], newline: boolean): string {
  if (!imports.length) {
    return '';
  }
  if (!newline) {
    return `"${imports[0]}"`;
  }
  return imports
    .sort()
    .map((s) => `\t"${s}"\n`)
    .join('');
}

function formatImports(imports: string[]): string {
  if (!imports.length) {
    return '';
  }

  const newlines = imports.length > 1;
  // Split the imports into system and user imports
  const sysImports: string[] = [];
  const usrImports: string[] = [];
  for (const s of imports) {
    if (s.includes('.')) {
      usrImports.push(s);
    } else {
      sysImports.push(s);
    }
  }

  const sysStr = joinImports(sysImports, newlines);
  const usrStr = joinImports(usrImports, newlines);
  // Add an empty line between system imports and user imports
  const hasSep = sysStr && usrStr;
  return `${sysStr}${hasSep ? '\n' : ''}${usrStr}`;
}

function makeImports(imports: string[]): string {
  const code = formatImports(imports);
  if (!code) {
    return '';
  }
  if (imports.length === 1) {
    return `import ${code}\n\n`;
  }
  return `import (
  ${code})\n\n`;
}

export function goCode(input: string, pkgName: string, dict: cm.SourceDict): string {
  let s = '';
  let isFirst = true;
  let baseType: cm.ExtendsField | undefined;
  let renameMap: Record<string, string> = {};
  let imports = new Set<string>();
  for (const [clsName, fields] of sortedObjEntries(dict)) {
    if (isFirst) {
      isFirst = false;
    } else {
      s += '\n';
    }
    let members: TypeMember[] = [];
    let ctor = false;
    for (const [_k, v] of sortedObjEntries(fields)) {
      const requiredProp = _k.endsWith('!');
      const k = cm.trimEnd(_k, '!');
      if (k.startsWith(cm.attrPrefix)) {
        // Attribute values may not be a string.
        const unknownValue = v as unknown;
        switch (k) {
          case goCtorAttr: {
            ctor = unknownValue === true;
            break;
          }

          case goExtendsAttr: {
            baseType = cm.parseExtendsFieldObj(unknownValue);
            break;
          }

          case goRenameAttr: {
            renameMap = cm.parseRenameMap(unknownValue);
            break;
          }

          default: {
            cm.checkAttr(k);
          }
        }
        continue;
      }

      members.push({
        name: cm.capitalize(renameMap[k] || k),
        paramName: k,
        type: v,
        tag: `\`json:"${k}${requiredProp ? '' : ',omitempty'}"\``,
      });
    }
    const genOpt: Options = {};
    if (ctor) {
      genOpt.ctorFunc = true;
      genOpt.returnValueInCtor = true;
    }
    if (baseType) {
      genOpt.bodyHeader = `\n\t${baseType.name}\n`;
      imports.add(baseType.path);
    }
    s += genGoType('struct', clsName, members, genOpt);
  }
  const importCode = imports.size ? makeImports([...imports.values()]) : '';
  return cm.copyrightString + cm.noticeComment(input) + `package ${pkgName}\n\n` + importCode + s;
}
