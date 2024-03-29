/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as staticRoute from '@qing/routes/static.js';
import { appDef } from '@qing/def';

export function staticMainImage(file: string): string {
  return `${staticRoute.imgMain}/${file}`;
}

export function post(id: string) {
  return `/${appDef.routePost}/${id}`;
}
