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
import isObj from 'is-plain-obj';
import * as cm from '../common/common.js';

const dirPath = np.dirname(fileURLToPath(import.meta.url));

async function buildJSONFileAsync(
  src: string,
  webDests: string[],
  serverDest: string,
  packageName: string,
  typeName: string,
  variableName: string,
) {
  const json = await mfs.readTextFileAsync(src);

  const jsonObj = JSON.parse(json) as unknown;
  if (!isObj(jsonObj)) {
    throw new Error(`Expect an object. Got ${json}`);
  }
  const goResult = goConvert(jsonObj, {
    packageName,
    typeName,
    variableName,
    hideJSONTags: true,
    disablePropertyFormatting: true,
  });
  const tsResult = tsConvert(jsonObj);

  await Promise.all([
    mfs.writeFileAsync(serverDest, cm.copyrightString + goResult),
    ...webDests.map((s) => mfs.writeFileAsync(s, cm.copyrightString + tsResult)),
  ]);
}

async function buildConstantsAsync() {
  return buildJSONFileAsync(
    np.join(dirPath, 'constants.json'),
    [cm.webSrcPath('sharedConstants.ts'), cm.itPath('base/sharedConstants.ts')],
    cm.serverPath('a/defs/shared_constants.go'),
    'defs',
    'SharedConstantsType',
    'Shared',
  );
}

await buildConstantsAsync();
