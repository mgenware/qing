/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mr from 'mingru';
import * as nodePath from 'path';
import gen from 'go-const-gen';
import * as mfs from 'm-fs';
import actions from './actions/actions.js';
import models from './models/models.js';
import { serverPath, copyrightString } from '../common/common.js';
import sharedConstants from './shared_constants.js';

const packageName = 'da';

async function buildConstantsAsync(path: string) {
  const goCode = gen(sharedConstants, {
    packageName,
    typeName: 'SharedConstants',
    variableName: 'Constants',
    hideJSONTags: true,
    disablePropertyFormatting: true,
    header:
      copyrightString +
      ` /******************************************************************************************
 * This code was automatically generated by go-const-gen.
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/\n\n`,
  });

  await mfs.writeFileAsync(path, goCode);
}

const mingruHeader =
  copyrightString +
  ` /******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/\n\n`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const dialect = new mr.MySQL();
  // Build Go code to '/server/da/` directory
  const daPath = serverPath('da');
  const builder = new mr.Builder(dialect, daPath, {
    cleanBuild: true,
    jsonTags: {
      keyStyle: mr.JSONKeyStyle.camelCase,
      excludeEmptyValues: true,
    },
    sqlFileHeader: mingruHeader,
    goFileHeader: mingruHeader,
  });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  await builder.buildAsync(async (): Promise<void> => {
    await Promise.all([
      await builder.buildActionsAsync(actions),
      await builder.buildCreateTableSQLFilesAsync(models),
    ]);
  });
  // Build `constants.go`.
  await buildConstantsAsync(nodePath.join(daPath, 'constants.go'));
})();
