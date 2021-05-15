/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mr from 'mingru';
import * as nodepath from 'path';
import gen from 'go-const-gen';
import { promises as fsPromises } from 'fs';
import { fileURLToPath } from 'url';
import actions from './actions/actions.js';
import models from './models/models.js';
import sharedConstants from './shared_constants.js';

const dirname = nodepath.dirname(fileURLToPath(import.meta.url));

const packageName = 'da';

async function buildConstantsAsync(path: string) {
  const goCode = await gen(sharedConstants, {
    packageName,
    typeName: 'SharedConstants',
    variableName: 'Constants',
    hideJSONTags: true,
    disablePropertyFormatting: true,
    header: `/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

 /******************************************************************************************
  * This code was automatically generated by go-const-gen.
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/\n\n`,
  });

  await fsPromises.writeFile(path, goCode);
}

(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '../da/` directory
  const daPath = nodepath.join(dirname, `../../${packageName}/`);
  const builder = new mr.Builder(dialect, daPath, {
    cleanBuild: true,
    jsonEncoding: {
      encodingStyle: mr.JSONEncodingStyle.camelCase,
      excludeEmptyValues: true,
    },
    fileHeader: `/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

 /******************************************************************************************
  * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/\n\n`,
  });
  await builder.buildAsync(async () => {
    Promise.all([
      await builder.buildActionsAsync(actions),
      await builder.buildCreateTableSQLFilesAsync(models),
    ]);
  });
  // Build `constants.go`.
  await buildConstantsAsync(nodepath.join(daPath, 'constants.go'));
})();
