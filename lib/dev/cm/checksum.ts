/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as crypto from 'crypto';
import * as fs from 'fs';

function checksumCore(data: crypto.BinaryLike) {
  return crypto.createHash('sha1').update(data).digest('hex');
}

export async function fileHashAsync(file: string) {
  const f = await fs.promises.readFile(file);
  return checksumCore(f);
}

export function stringHash(s: string) {
  return checksumCore(s);
}
