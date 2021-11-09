/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { promises as fsPromises } from 'fs';
import goConvert from 'go-const-gen';
import tsConvert from 'json-to-js-const';
import nodePath from 'path';
import { fileURLToPath } from 'url';
import { serverPath, webPath, copyrightString } from '../common/common.js';

const dirPath = nodePath.dirname(fileURLToPath(import.meta.url));

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
    fsPromises.writeFile(serverDest, copyrightString + goResult),
    fsPromises.writeFile(webDest, copyrightString + tsResult),
  ]);
}

async function buildConstantsAsync() {
  return buildJSONFileAsync(
    nodePath.join(dirPath, 'constants.json'),
    webPath('src/sharedConstants.ts'),
    serverPath('app/defs/shared_constants.go'),
    'defs',
    'SharedConstantsType',
    'Shared',
  );
}

await buildConstantsAsync();
