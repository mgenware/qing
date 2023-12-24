/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as cm from './common.js';
import * as np from 'node:path';
import * as qdu from '@qing/dev';

function tsAttr(s: string) {
  return `__ts_${s}`;
}

const tsImportsAttr = tsAttr('imports');

cm.addAllowedAttrs([tsImportsAttr]);

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
      return type;
  }
}

interface HandleTypeRes {
  // `Cmt`.
  typeName: string;
  optional: boolean;
}

function handleType(
  type: string,
  traits: cm.PropertyTraits,
  daImports: Set<string>,
  sodImports: Map<string, Set<string>>,
): HandleTypeRes {
  if (type.startsWith(':')) {
    const [sType, extractedType] = cm.parseSpecialType(type);
    if (sType === cm.SpecialType.da) {
      daImports.add(extractedType);
      type = extractedType;
    } else if (sType === cm.SpecialType.sod) {
      const res = cm.parseSodSpecialTypeString(extractedType);
      sodImports.set(res.file, (sodImports.get(res.file) ?? new Set<string>()).add(res.type));
      type = res.type;
    } else {
      throw new Error('Unsupported type');
    }
  } else {
    type = sourceTypeToTSType(type);
  }
  return {
    typeName: handleTypeName(type, traits),
    optional: !traits.notEmpty,
  };
}

export function tsCode(input: string, dict: cm.SourceDict): string {
  let code = '';
  let isFirst = true;
  const imports = new Set<string>();
  const daImports = new Set<string>();
  const sodImports = new Map<string, Set<string>>();
  for (const [typeName, typeDef] of Object.entries(dict)) {
    if (isFirst) {
      isFirst = false;
    } else {
      code += '\n';
    }
    let typeCode = '';
    const attrData = cm.scanTypeDef(
      false,
      typeDef,
      (k, v) => {
        // eslint-disable-next-line default-case
        switch (k) {
          case tsImportsAttr: {
            for (const ipt of cm.parseImports(v)) {
              imports.add(`import ${ipt};`);
            }
            break;
          }
        }
      },
      (k, v, traits) => {
        const typeRes = handleType(v, traits, daImports, sodImports);
        typeCode += `  ${k}${typeRes.optional ? '?' : ''}: ${typeRes.typeName};\n`;
      },
    );
    typeCode += '}\n';

    // Interface declaration is handled at last since base class can
    // only be determined when all attrs are processed.
    let extendsCode = '';
    if (attrData.extends?.length) {
      let first = true;
      for (const bt of attrData.extends) {
        if (typeof bt === 'string') {
          const typeRes = handleType(
            bt,
            { optional: false, isArray: false, notEmpty: true },
            daImports,
            sodImports,
          );
          // Imports are handled in `handleType` for special types.
          extendsCode += typeRes.typeName;
        } else {
          if (bt.path) {
            imports.add(`import { ${bt.name} } from '${bt.path}';`);
            extendsCode += `${first ? '' : ','} ${bt.name}`;
          }
          extendsCode += bt.name;
        }
        if (first) {
          first = false;
        } else {
          extendsCode += ', ';
        }
      }
    }

    typeCode = `export interface ${typeName}${
      attrData.extends?.length ? ` extends ${extendsCode}` : ''
    } {\n${typeCode}`;

    code += typeCode;
  }

  if (daImports.size) {
    imports.add(`import { ${[...daImports].join(', ')} } from '../da/types.js';`);
  }

  if (sodImports.size) {
    for (const [file, types] of sodImports.entries()) {
      // `input` is like `path/path/file`.
      const rootPath = np.relative(input, input.split('/')[0]!);
      let importPath = np.join(rootPath, `${file}.js`);
      if (!importPath.startsWith('.')) {
        importPath = `./${importPath}`;
      }
      imports.add(`import { ${[...types].join(', ')} } from '${importPath}';`);
    }
  }

  const importCode = imports.size ? [...imports.values()].map((s) => `${s}\n`).join('') + '\n' : '';
  return (
    qdu.copyrightString + ' /* eslint-disable */\n\n' + cm.noticeComment(input) + importCode + code
  );
}
