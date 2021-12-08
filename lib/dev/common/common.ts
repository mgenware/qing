/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import nodePath from 'path';
import mfs from 'm-fs';
import { fileURLToPath } from 'url';

export const copyrightString = `/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */\n\n`;

export const copyrightStringYAML = `#
# Copyright (C) The Qing Project. All rights reserved.
#
# Use of this source code is governed by a license that
# can be found in the LICENSE file.
#\n\n`;

const dirPath = nodePath.dirname(fileURLToPath(import.meta.url));
const rootDir = nodePath.join(dirPath, '../../../..');
export const langsDir = `${rootDir}/userland/langs`;
export const langsDataDir = `${langsDir}/data`;
export const defaultLangPath = `${langsDataDir}/en.json`;

export function serverPath(path: string): string {
  return `${rootDir}/server/${path}`;
}

export function webPath(path: string): string {
  return `${rootDir}/web/${path}`;
}

export function sodPath(): string {
  return `${rootDir}/lib/dev/sod/objects`;
}

export function serverSodPath(): string {
  return serverPath('sod');
}

export function webSodPath(): string {
  return webPath('sod');
}

export async function langNamesAsync(): Promise<string[]> {
  const jsonFile = langsDir + '/langs.json';
  const obj = JSON.parse(await mfs.readTextFileAsync(jsonFile)) as any;
  const names = obj.langs as string[];
  if (!Array.isArray(names)) {
    throw new Error(`Assertion failed. \`names\` is not an array. Got: ${names}`);
  }
  return names;
}

export function langDataPath(name: string): string {
  return `${langsDataDir}/${name}.json`;
}
