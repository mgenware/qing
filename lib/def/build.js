/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mfs from 'm-fs';
import goConstGen from 'go-const-gen';
import jsConstGen from 'json-to-js-const';
import np from 'path';
import { fileURLToPath } from 'url';
import isObj from 'is-plain-obj';
import { pathUtil } from '@qing/util';

const dirPath = np.dirname(fileURLToPath(import.meta.url));
const outputDir = './g';
const goNamespace = 'def';

async function buildJSONFileAsync(
  src,
  name,
) {
  const json = await mfs.readTextFileAsync(src);
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1);

  const jsonObj = JSON.parse(json);
  if (!isObj(jsonObj)) {
    throw new Error(`Expect an object. Got ${json}`);
  }
  const goResult = goConstGen(jsonObj, {
    goNamespace,
    typeName: `${pascalName}Type`,
    variableName: pascalName,
    hideJSONTags: true,
    disablePropertyFormatting: true,
  });
  const jsContent = jsConstGen(jsonObj);
  const dtsContent = jsConstGen(jsonObj, {dts: true});

  await Promise.all([
    mfs.writeFileAsync(`${outputDir}/${name}.js`, jsContent),
    mfs.writeFileAsync(`${outputDir}/${name}.d.ts`, dtsContent),
    mfs.writeFileAsync(`${pathUtil.serverPath(`a/def/${name}.go`)}`, goResult),
  ]);
}

async function buildConstantsAsync() {
  return Promise.all(['app', 'db'].map(f => buildJSONFileAsync(`./src/${f}.json`,f)));
}

await buildConstantsAsync();
