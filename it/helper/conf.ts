/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as apiConf from '@qing/routes/d/dev/api/conf.js';
import { api } from 'api.js';
import { diff } from 'just-diff';

export interface GetConfigsResult {
  loaded: string;
  disk: string;
}

export function getDevConfigs() {
  return api<GetConfigsResult>(apiConf.getConfigs, null, null);
}

export async function getUnloadedConfigChanges() {
  const res = await getDevConfigs();
  const loaded = JSON.parse(res.loaded) as object;
  const disk = JSON.parse(res.disk) as object;
  const changes = diff(loaded, disk);
  return changes;
}
