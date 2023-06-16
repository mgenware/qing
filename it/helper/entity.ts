/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as composeRoute from '@qing/routes/s/pri/compose.js';
import * as apiCompose from '@qing/routes/dev/api/compose.js';
import { api, APIOptions, User } from 'api.js';

export function delEntity(id: string, type: number, user: User) {
  return api(composeRoute.delEntity, { entity: { id, type } }, user);
}

export function setEntity(
  type: number,
  body: Record<string, unknown>,
  user: User,
  opt?: APIOptions,
) {
  return api<string | null>(composeRoute.setEntity, { ...body, entityType: type }, user, opt);
}

export interface EntitySrcResult {
  contentHTML: string;
  title: string;
}

export function entitySrc(id: string, type: number, user: User) {
  return api<EntitySrcResult>(composeRoute.entitySource, { entity: { id, type } }, user);
}

export async function updateEntityTime(id: string, type: number) {
  return api(apiCompose.setDebugTime, { id, type }, null);
}

export async function deletePostsByPrefix(prefix: string) {
  return api(apiCompose.deletePostsByPrefix, { prefix }, null);
}
