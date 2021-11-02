/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import nodePath from 'path';
import confgen from 'jsconfgen';
import { serverPath } from '../common/common.js';

async function buildConf() {
  const serverDir = serverPath('');
  const src = nodePath.join(serverDir, 'docker-compose.mjs');
  const dest = nodePath.join(serverDir, 'docker-compose.yml');
  await confgen('yaml', src, dest);
}

await buildConf();
