/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as composeRoute from '@qing/routes/d/s/pri/compose';
import * as apiCompose from '@qing/routes/d/dev/api/compose';
import { call, CallOptions, User } from 'api';

export function delEntity(id: string, type: number, user: User) {
  return call(composeRoute.delEntity, { entity: { id, type } }, user);
}

export function setEntity(
  type: number,
  body: Record<string, unknown>,
  user: User,
  opt?: CallOptions,
) {
  return call(composeRoute.setEntity, { ...body, entityType: type }, user, opt);
}

export async function entitySrc(id: string, type: number, user: User) {
  const r = await call(composeRoute.entitySource, { entity: { id, type } }, user);
  return r.d;
}

export async function updateEntityTime(id: string, type: number) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return call(apiCompose.setDebugTime, { id, type }, null);
}
