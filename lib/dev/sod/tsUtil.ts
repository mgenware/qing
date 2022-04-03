/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as cm from './common.js';
import * as qdu from '@qing/devutil';

const tsExtendsAttr = '__ts_extends';

cm.addAllowedAttrs([tsExtendsAttr]);

export function sourceTypeFieldToTSType(type: string): string {
  switch (type) {
    case 'bool':
      return 'boolean';
    case 'int':
    case 'uint':
    case 'uint64':
    case 'double':
      return 'number';
    case 'string':
      return 'string';
    default:
      return type.startsWith('*') ? type.substring(1) : type;
  }
}

function handleImportPath(s: string) {
  if (s === cm.daPathPrefix) {
    return '../da/types.js';
  }
  if (s.startsWith(cm.sodPathPrefix)) {
    return `../${s.substring(cm.sodPathPrefix.length)}.js`;
  }
  return s;
}

export function tsCode(input: string, dict: cm.SourceDict): string {
  let code = '';
  let isFirst = true;
  const imports = new Set<string>();
  for (const [typeName, typeDef] of Object.entries(dict)) {
    let baseTypes: cm.ExtendsField[] = [];
    if (isFirst) {
      isFirst = false;
    } else {
      code += '\n';
    }
    let typeCode = '';
    cm.scanTypeDef(
      typeDef,
      (k, v) => {
        // eslint-disable-next-line default-case
        switch (k) {
          case tsExtendsAttr: {
            baseTypes = cm.parseExtendsValue(v);
            break;
          }
        }
      },
      (k, v, requiredProp) => {
        typeCode += `  ${k}${requiredProp ? '' : '?'}: ${sourceTypeFieldToTSType(v)};\n`;
      },
    );
    typeCode += '}\n';

    // Interface declaration is handled at last since base class can
    // only be determined when all attrs are processed.
    typeCode = `export interface ${typeName}${
      baseTypes.length ? ` extends ${baseTypes.map((t) => t.name).join(', ')}` : ''
    } {\n${typeCode}`;

    baseTypes.forEach((t) => {
      if (t.path) {
        imports.add(`import { ${t.name} } from '${handleImportPath(t.path)}';`);
      }
    });

    code += typeCode;
  }
  const importCode = imports.size ? [...imports.values()].map((s) => `${s}\n`).join('') + '\n' : '';
  return (
    qdu.copyrightString + '/* eslint-disable */\n\n' + cm.noticeComment(input) + importCode + code
  );
}
