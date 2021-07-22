/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { promises as fs } from 'fs';

export const copyrightString = `/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that
 * can be found in the LICENSE file.
 */\n\n`;

export const langsDir = '../userland/langs/';
export const langsDataDir = langsDir + 'data/';

export const defaultLangPath = langsDataDir + 'en.json';

export function serverPath(path: string): string {
  return `../server/${path}`;
}

export function webPath(path: string): string {
  return `./${path}`;
}

export async function langNamesAsync(): Promise<string[]> {
  const jsonFile = langsDir + 'langs.json';
  const obj = JSON.parse(await fs.readFile(jsonFile, 'utf8')) as any;
  const names = obj.langs as string[];
  if (!Array.isArray(names)) {
    throw new Error(`Assertion failed. \`names\` is not an array. Got: ${names}`);
  }
  return names;
}

export function langDataPath(name: string): string {
  return langsDataDir + `${name}.json`;
}
