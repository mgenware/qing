/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as np from 'path';
import * as mfs from 'm-fs';
import { fileURLToPath } from 'url';

const join = np.join;

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

const dirPath = np.dirname(fileURLToPath(import.meta.url));
const rootDir = join(dirPath, '../../../..');
export const langsDir = join(rootDir, 'userland/langs');
export const langsDataDir = join(langsDir, 'data');
export const defaultLangPath = join(langsDataDir, 'en.json');

export function serverPath(path?: string): string {
  return join(rootDir, 'server', path || '');
}

export function webPath(path?: string): string {
  return join(rootDir, 'web', path || '');
}

export function webSrcPath(path?: string): string {
  return join(webPath('src'), path || '');
}

export function sodPath(path?: string): string {
  return join(rootDir, 'lib/dev/sod/objects', path || '');
}

export function serverSodPath(): string {
  return serverPath('sod');
}

export function webSodPath(): string {
  return webSrcPath('sod');
}

export async function langNamesAsync(): Promise<string[]> {
  const jsonFile = join(langsDir, 'langs.json');
  const obj = JSON.parse(await mfs.readTextFileAsync(jsonFile)) as any;
  const names = obj.langs as string[];
  if (!Array.isArray(names)) {
    throw new Error(`Assertion failed. \`names\` is not an array. Got: ${names}`);
  }
  return names;
}

export function langDataPath(name: string): string {
  return join(langsDataDir, `${name}.json`);
}
