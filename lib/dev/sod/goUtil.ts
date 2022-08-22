/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { genGoType, TypeMember, Options, BaseType } from 'gen-go-type';
import * as np from 'path';
import * as cm from './common.js';
import * as qdu from '@qing/devutil';

export const goOutDirAttr = '__go_out_dir';
const goCtorAttr = '__go_ctor';
const goExtendsAttr = '__go_extends';
const goRenameAttr = '__go_rename';

cm.addAllowedAttrs([goCtorAttr, goExtendsAttr, goRenameAttr]);

function joinImports(
  imports: string[],
  aliases: Map<string, string> | undefined,
  newline: boolean,
): string {
  if (!imports.length) {
    return '';
  }
  if (!newline) {
    const alias = aliases?.get(imports[0]!);
    return `${alias ? `${alias} ` : ''}"${imports[0]}"`;
  }
  return imports
    .sort()
    .map((s) => {
      const alias = aliases?.get(s);
      return `\t${alias ? `${alias} ` : ''}"${s}"\n`;
    })
    .join('');
}

function formatImports(imports: string[], aliases: Map<string, string> | undefined): string {
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

  const sysStr = joinImports(sysImports, aliases, newlines);
  const usrStr = joinImports(usrImports, aliases, newlines);
  // Add an empty line between system imports and user imports
  const hasSep = sysStr && usrStr;
  return `${sysStr}${hasSep ? '\n' : ''}${usrStr}`;
}

function makeImports(imports: string[], aliases?: Map<string, string>): string {
  const code = formatImports(imports, aliases);
  if (!code) {
    return '';
  }
  if (imports.length === 1) {
    return `import ${code}\n\n`;
  }
  return `import (
  ${code})\n\n`;
}

function handleImportPath(s: string) {
  if (s === cm.daPathPrefix) {
    return 'qing/da';
  }
  if (s.startsWith(cm.sodPathPrefix)) {
    return `qing/sod/${s.substring(cm.sodPathPrefix.length)}`;
  }
  return s;
}

export function goCode(input: string, pkgName: string, dict: cm.SourceDict): string {
  let s = '';
  let isFirst = true;
  let baseTypes: cm.ExtendsField[] = [];
  let renameMap: Record<string, string> = {};
  const imports = new Set<string>();
  const importAliases = new Map<string, string>();
  for (const [typeName, typeDef] of Object.entries(dict)) {
    if (isFirst) {
      isFirst = false;
    } else {
      s += '\n';
    }
    const members: TypeMember[] = [];
    let ctor = false;
    cm.scanTypeDef(
      true,
      typeDef,
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (k, v) => {
        // Attribute values may not be a string.
        // eslint-disable-next-line default-case
        switch (k) {
          case goCtorAttr: {
            ctor = v === true;
            break;
          }

          case goExtendsAttr: {
            baseTypes = cm.parseExtendsValue(v);
            break;
          }

          case goRenameAttr: {
            renameMap = cm.parseRenameMap(v);
            break;
          }
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (k, v) => {
        members.push({
          name: renameMap[k] || cm.capitalizeFirstLetter(k),
          paramName: k,
          type: v,
          tag: `\`json:"${k},omitempty"\``,
        });
      },
    );
    const genOpt: Options = {};
    // False positive. `ctor` is changed in closure.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (ctor) {
      genOpt.ctorFunc = true;
      genOpt.returnValueInCtor = true;
    }
    let goGenBaseTypes: BaseType[] = [];
    if (baseTypes.length) {
      baseTypes.forEach((t) => {
        goGenBaseTypes.push({
          name: t.name,
          paramName: cm.lowerFirstLetter(t.name),
          packageName: t.packageName,
        });

        if (t.path) {
          const importPath = handleImportPath(t.path);
          imports.add(importPath);
          if (t.packageName && np.basename(importPath) !== t.packageName) {
            importAliases.set(importPath, t.packageName);
          }
        }
      });
    }
    s += genGoType('struct', typeName, members, genOpt, goGenBaseTypes);
  }
  const importCode = imports.size ? makeImports([...imports.values()], importAliases) : '';
  return qdu.copyrightString + cm.noticeComment(input) + `package ${pkgName}\n\n` + importCode + s;
}
