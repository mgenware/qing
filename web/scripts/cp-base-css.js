/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

// This script copies the `qing-base-css` in `node_modules` to `src/css` in dev mode.

import { promises as fs } from 'node:fs';
import * as np from 'node:path';

await fs.copyFile(
  np.resolve('./node_modules/qing-css-base/dist/main.min.css'),
  np.resolve('./src/css/base.css'),
);
