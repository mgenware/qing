/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import sortedObjEntries from 'sorted-object-entries';
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
  let s = '';
  let isFirst = true;
  let baseType: cm.ExtendsField | undefined;
  for (const [clsName, fields] of sortedObjEntries(dict)) {
    if (isFirst) {
      isFirst = false;
    } else {
      s += '\n';
    }
    for (const [_k, v] of sortedObjEntries(fields)) {
      const requiredProp = _k.endsWith('!');
      const k = cm.trimEnd(_k, '!');
      if (k.startsWith(cm.attrPrefix)) {
        // Attribute values may not be a string.
        const unknownValue = v as unknown;
        switch (k) {
          case tsExtendsAttr: {
            baseType = cm.parseExtendsFieldObj(unknownValue);
            break;
          }

          default: {
            cm.checkAttr(k);
          }
        }
        continue;
      }
      s += `  ${k}${requiredProp ? '' : '?'}: ${sourceTypeFieldToTSType(v)};\n`;
    } // end of for.
    s += `}\n`;

    // Interface declaration is handled at last since base class can
    // only be determined when all attrs are processed.
    s = `export interface ${clsName}${baseType?.name ? ` extends ${baseType?.name}` : ''} {\n` + s;
  }
  const imports = baseType?.path ? `import { ${baseType?.name} } from '${baseType.path}';\n\n` : '';
  return cm.copyrightString + cm.noticeComment(input) + imports + s;
}
