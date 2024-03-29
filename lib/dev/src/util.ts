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

export const defaultLangFile = 'en.json';
const userlandDirName = 'userland';

const dirPath = np.dirname(fileURLToPath(import.meta.url));
const rootDir = np.join(dirPath, '../../..');
export const langDir = np.join(rootDir, `${userlandDirName}/langs`);
export const webLangDir = np.join(langDir, 'web');
export const serverLangDir = np.join(langDir, 'server');
export const defaultServerLangFile = np.join(serverLangDir, defaultLangFile);

export function serverPath(path = ''): string {
  return np.join(rootDir, 'server', path);
}

export function webPath(path = ''): string {
  return np.join(rootDir, 'web', path);
}

export function webSrcPath(path = ''): string {
  return np.join(webPath('src'), path);
}

export function userlandPath(path = ''): string {
  return np.join(rootDir, userlandDirName, path);
}

function devConfigPath(folder: string, name: string): string {
  return np.join(userlandPath('config'), 'dev', folder, `${name}.json`);
}

export function coreConfigPath(name: string): string {
  return devConfigPath('core', name);
}

export function appConfigPath(name: string): string {
  return devConfigPath('app', name);
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

export function webSrcTypesPath(): string {
  return webSrcPath('@types');
}

export async function langNamesAsync(): Promise<string[]> {
  const jsonFile = np.join(langDir, 'langs.json');
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
