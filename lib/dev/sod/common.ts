/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

export const attrPrefix = '__';

const allowedAttrs = new Set<string>();

function checkAttr(attr: string) {
  if (!allowedAttrs.has(attr)) {
    throw new Error(`Unknown attr ${attr}`);
  }
}

export function addAllowedAttrs(attrs: string[]) {
  for (const attr of attrs) {
    allowedAttrs.add(attr);
  }
}

export type SourceDict = Record<string, Record<string, unknown>>;

export function noticeComment(input: string): string {
  return ` /******************************************************************************************
  * Do not edit this file manually.
  * Automatically generated via \`qing sod ${input}\`.
  * See \`lib/dev/sod/objects/${input}.yaml\` for details.
  ******************************************************************************************/\n\n`;
}

export function capitalizeFirstLetter(s: string) {
  if (s === 'id') {
    return 'ID';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function lowerFirstLetter(s: string) {
  if (s === 'ID') {
    return 'id';
  }
  return s.charAt(0).toLocaleLowerCase() + s.slice(1);
}

export function trimEnd(s: string, suffix: string): string {
  if (s.endsWith(suffix)) {
    return s.substr(0, s.length - suffix.length);
  }
  return s;
}

export function popDictAttribute(dict: Record<string, string>, key: string): string | null {
  const val = dict[key];
  if (val) {
    // eslint-disable-next-line no-param-reassign
    delete dict[key];
    return val;
  }
  return null;
}

export interface ExtendsField {
  name: string;
  path?: string;
  packageName?: string;
}

export function parseExtendsFieldObj(obj: unknown): ExtendsField {
  if (typeof obj !== 'object') {
    throw new Error(`Expected an object, got ${JSON.stringify(obj)}`);
  }
  const objDict = obj as Record<string, string>;
  const { name, path, packageName } = objDict;
  if (!name) {
    throw new Error(`Missing name param. Got ${JSON.stringify(obj)}`);
  }
  return { name, path, packageName };
}

export function parseRenameMap(obj: unknown): Record<string, string> {
  if (typeof obj !== 'object') {
    throw new Error(`Expected an object, got ${JSON.stringify(obj)}`);
  }
  return obj as Record<string, string>;
}

export function scanTypeDef(
  src: Record<string, unknown>,
  attrCb: (k: string, v: unknown) => void,
  propCb: (k: string, v: string, required: boolean) => void,
) {
  // Handle attrs first.
  for (const [k, v] of Object.entries(src)) {
    if (k.startsWith(attrPrefix)) {
      checkAttr(k);
      attrCb(k, v);
    } else {
      continue;
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  for (const [_k, v] of Object.entries(src)) {
    if (_k.startsWith(attrPrefix)) {
      continue;
    } else {
      if (typeof v !== 'string') {
        throw new Error(`Property value must be a string. Got ${v}`);
      }
      const requiredProp = _k.endsWith('!');
      const k = trimEnd(_k, '!');
      propCb(k, v, requiredProp);
    }
  }
}
