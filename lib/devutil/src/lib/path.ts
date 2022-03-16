/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as np from 'path';
import * as mfs from 'm-fs';
import { fileURLToPath } from 'url';
import isObj from 'is-plain-obj';

const dirPath = np.dirname(fileURLToPath(import.meta.url));
const rootDir = np.join(dirPath, '../../../..');
export const langsDir = np.join(rootDir, 'userland/langs');
export const langsDataDir = np.join(langsDir, 'data');
export const defaultLangPath = np.join(langsDataDir, 'en.json');

export function serverPath(path = ''): string {
  return np.join(rootDir, 'server', path);
}

export function webPath(path = ''): string {
  return np.join(rootDir, 'web', path);
}

export function webSrcPath(path = ''): string {
  return np.join(webPath('src'), path);
}

export function itPath(path = ''): string {
  return np.join(rootDir, 'it', path);
}

export function sodPath(path = ''): string {
  return np.join(rootDir, 'lib/dev/sod/objects', path);
}

export function serverSodPath(): string {
  return serverPath('sod');
}

export function webSodPath(): string {
  return webSrcPath('sod');
}

export async function langNamesAsync(): Promise<string[]> {
  const jsonFile = np.join(langsDir, 'langs.json');
  const obj = JSON.parse(await mfs.readTextFileAsync(jsonFile)) as unknown;
  if (!isObj(obj)) {
    throw new Error(`Expect an object. Got $${JSON.stringify(obj)}`);
  }
  const names = obj.langs as string[];
  if (!Array.isArray(names)) {
    throw new Error(`Assertion failed. \`names\` is not an array. Got: ${names}`);
  }
  return names;
}

export function langDataPath(name: string): string {
  return np.join(langsDataDir, `${name}.json`);
}
