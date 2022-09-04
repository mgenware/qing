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

function handleTypeName(name: string, traits: cm.PropertyTraits) {
  if (traits.isArray) {
    return `${name}[]`;
  }
  return name;
}

function sourceTypeToTSType(type: string) {
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
      // Strip pointer indicator (*). No pointers in JS.
      return type.startsWith('*') ? type.substring(1) : type;
  }
}

// Returns [<resolved type>, <optional>].
function convertType(type: string, traits: cm.PropertyTraits): [string, boolean] {
  // Some types are always optional because SOD Go types have omitifempty tags on.
  // So even if a field set in Go, it can be optional when transferred back to TS.
  const tsType = sourceTypeToTSType(type);
  return [handleTypeName(tsType, traits), !traits.notEmpty];
}

function handleImportPath(s: string, name: string) {
  if (s === cm.daPathPrefix) {
    return '../da/types.js';
  }
  if (s.startsWith(cm.sodPathPrefix)) {
    return `../${s.substring(cm.sodPathPrefix.length)}/${cm.lowerFirstLetter(name)}.js`;
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
      false,
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
      (k, v, traits) => {
        const [type, optional] = convertType(v, traits);
        typeCode += `  ${k}${optional ? '?' : ''}: ${type};\n`;
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
        imports.add(`import { ${t.name} } from '${handleImportPath(t.path, t.name)}';`);
      }
    });

    code += typeCode;
  }
  const importCode = imports.size ? [...imports.values()].map((s) => `${s}\n`).join('') + '\n' : '';
  return (
    qdu.copyrightString + ' /* eslint-disable */\n\n' + cm.noticeComment(input) + importCode + code
  );
}
