/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import goConvert from 'go-const-gen';
import tsConvert from 'json-to-js-const';
import np from 'path';
import { fileURLToPath } from 'url';
import { serverPath, webPath, copyrightString } from '../common/common.js';

const dirPath = np.dirname(fileURLToPath(import.meta.url));

async function buildJSONFileAsync(
  src: string,
  webDest: string,
  serverDest: string,
  packageName: string,
  typeName: string,
  variableName: string,
) {
  const json = await mfs.readTextFileAsync(src);

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
    mfs.writeFileAsync(serverDest, copyrightString + goResult),
    mfs.writeFileAsync(webDest, copyrightString + tsResult),
  ]);
}

async function buildConstantsAsync() {
  return buildJSONFileAsync(
    np.join(dirPath, 'constants.json'),
    webPath('src/sharedConstants.ts'),
    serverPath('app/defs/shared_constants.go'),
    'defs',
    'SharedConstantsType',
    'Shared',
  );
}

await buildConstantsAsync();
