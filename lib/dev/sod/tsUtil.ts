/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as cm from './common.js';

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

export function tsCode(input: string, dict: cm.SourceDict): string {
  let code = '';
  let isFirst = true;
  const imports = new Set<string>();
  for (const [typeName, typeDef] of Object.entries(dict)) {
    let baseType: cm.ExtendsField | undefined;
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
            baseType = cm.parseExtendsFieldObj(v);
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
      baseType?.name ? ` extends ${baseType.name}` : ''
    } {\n${typeCode}`;

    if (baseType?.path) {
      imports.add(`import { ${baseType.name} } from '${baseType.path}';`);
    }

    code += typeCode;
  }
  const importCode = imports.size ? [...imports.values()].map((s) => `${s}\n`).join('') + '\n' : '';
  return (
    cm.copyrightString + '/* eslint-disable */\n\n' + cm.noticeComment(input) + importCode + code
  );
}
