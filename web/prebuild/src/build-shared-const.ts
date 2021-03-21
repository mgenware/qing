/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { promises as fsPromises } from 'fs';
import goConvert from 'go-const-gen';
import tsConvert from 'json-to-js-const';
import { serverPath, webPath } from './paths.js';

async function buildJSONFileAsync(
  src: string,
  webDest: string,
  serverDest: string,
  packageName: string,
  typeName: string,
  variableName: string,
) {
  const json = await fsPromises.readFile(src, 'utf8');

  const jsonObj = JSON.parse(json);
  const goResult = await goConvert(jsonObj, {
    packageName,
    typeName,
    variableName,
    hideJSONTags: true,
    disablePropertyFormatting: true,
  });
  const tsResult = tsConvert(jsonObj);

  await Promise.all([
    fsPromises.writeFile(serverDest, goResult),
    fsPromises.writeFile(webDest, tsResult),
  ]);
}

async function buildSharedConstantsAsync() {
  return buildJSONFileAsync(
    webPath('src/app/shared_constants.json'),
    webPath('src/sharedConstants.ts'),
    serverPath('app/defs/shared_constants.go'),
    'defs',
    'SharedConstantsType',
    'Shared',
  );
}

async function buildDBConstantsAsync() {
  return buildJSONFileAsync(
    serverPath('mingru/src/constants.json'),
    webPath('src/dbConstants.ts'),
    serverPath('app/defs/db_constants.go'),
    'defs',
    'DBConstantsType',
    'DB',
  );
}

await Promise.all([buildSharedConstantsAsync(), buildDBConstantsAsync()]);
