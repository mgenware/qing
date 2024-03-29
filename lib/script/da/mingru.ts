/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mr from 'mingru';
import * as qdu from '@qing/dev/util.js';
import source from './actions/source.js';

const mingruHeader =
  qdu.copyrightString +
  `/******************************************************************************************
 * This file was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/\n\n`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // Build Go code to '/server/da/` directory
  const daPath = qdu.serverPath('da');
  const tsOutDir = qdu.webPath('src/da');
  const builder = new mr.Builder(daPath, {
    cleanOutDir: true,
    jsonTags: {
      keyStyle: mr.JSONKeyStyle.camelCase,
      excludeEmptyValues: true,
    },
    sqlFileHeader: mingruHeader,
    goFileHeader: mingruHeader,
    typesTSHeader: `/* eslint-disable */\n\n${mingruHeader}`,
    tsOutDir,
    createTableSQL: true,
  });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  await builder.build(source);
})();
