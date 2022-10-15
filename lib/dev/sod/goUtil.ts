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

function goAttr(s: string) {
  return `__go_${s}`;
}

const goCtorAttr = goAttr('ctor');
const goImportsAttr = goAttr('imports');
const goRenameAttr = goAttr('rename');

cm.addAllowedAttrs([goCtorAttr, goRenameAttr, goImportsAttr]);

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

// Compared to TS types, GO types require more details for constructor generation.
interface HandleTypeRes {
  // `[]*cmtSod.Cmt`.
  fullType: string;
  // `cmtSod`.
  packageName: string;
  // `Cmt`.
  typeName: string;
  isDAImport: boolean;
}

function handleType(
  type: string,
  traits: cm.PropertyTraits,
  sodImports: Set<string>,
): HandleTypeRes {
  let packageName = '';
  let isDAImport = false;
  if (type.startsWith(':')) {
    const [sType, extractedType] = cm.parseSpecialType(type);
    if (sType === cm.SpecialType.da) {
      isDAImport = true;
      type = extractedType;
      packageName = 'da';
    } else if (sType === cm.SpecialType.sod) {
      const res = cm.parseSodSpecialTypeString(extractedType);

      // Add import path.
      const yamlDirPath = np.dirname(res.file);
      sodImports.add(`qing/sod/${yamlDirPath}Sod`);

      // Get package name, which is the folder name of yaml file.
      const folderName = np.basename(yamlDirPath);
      type = res.type;
      packageName = `${folderName}Sod`;
    } else {
      throw new Error('Unsupported type');
    }
  }

  let fullType = type;
  if (packageName) {
    fullType = `${packageName}.${fullType}`;
  }
  return {
    fullType: `${traits.isArray ? '[]' : ''}${traits.optional ? '*' : ''}${fullType}`,
    isDAImport,
    packageName,
    typeName: type,
  };
}

export function goCode(input: string, pkgName: string, dict: cm.SourceDict): string {
  let s = '';
  let isFirst = true;
  let renameMap: Record<string, string> = {};
  const imports = new Set<string>();
  const importAliases = new Map<string, string>();
  const sodImports = new Set<string>();
  let hasDAImports = false;

  // Used whenever `handleType` is called.
  function handleTypeRes(res: HandleTypeRes) {
    if (res.isDAImport) {
      hasDAImports = true;
    }
  }

  for (const [typeName, typeDef] of Object.entries(dict)) {
    if (isFirst) {
      isFirst = false;
    } else {
      s += '\n';
    }
    const members: TypeMember[] = [];
    let ctor = false;
    const attrData = cm.scanTypeDef(
      true,
      typeDef,
      (k, v) => {
        // Attribute values may not be a string.
        // eslint-disable-next-line default-case
        switch (k) {
          case goCtorAttr: {
            ctor = v === true;
            break;
          }

          case goRenameAttr: {
            renameMap = cm.parseRenameMap(v);
            break;
          }

          case goImportsAttr: {
            for (const ipt of cm.parseImports(v)) {
              imports.add(ipt);
            }
            break;
          }
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (k, v, traits) => {
        const name = renameMap[k] || k;
        const typeRes = handleType(v, traits, sodImports);

        handleTypeRes(typeRes);
        members.push({
          name: `${cm.capitalizeFirstLetter(name)}`,
          paramName: name,
          type: typeRes.fullType,
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

    if (attrData.extends?.length) {
      attrData.extends.forEach((t) => {
        if (typeof t === 'string') {
          const typeRes = handleType(
            t,
            { optional: false, isArray: false, notEmpty: true },
            sodImports,
          );
          handleTypeRes(typeRes);

          console.log('---- ', typeRes);
          goGenBaseTypes.push({
            name: typeRes.typeName,
            paramName: cm.lowerFirstLetter(typeRes.typeName),
            packageName: typeRes.packageName,
          });
        } else {
          goGenBaseTypes.push({
            name: t.name,
            paramName: cm.lowerFirstLetter(t.name),
            packageName: t.packageName,
          });

          if (t.path) {
            const importPath = t.path;
            imports.add(importPath);
            if (t.packageName && np.basename(importPath) !== t.packageName) {
              importAliases.set(importPath, t.packageName);
            }
          }
        }
      });
    }
    if (hasDAImports) {
      imports.add('qing/da');
    }
    if (sodImports.size) {
      for (const s of [...sodImports]) {
        imports.add(s);
      }
    }
    s += genGoType('struct', typeName, members, genOpt, goGenBaseTypes);
  }
  const importCode = imports.size ? makeImports([...imports.values()], importAliases) : '';
  return qdu.copyrightString + cm.noticeComment(input) + `package ${pkgName}\n\n` + importCode + s;
}
