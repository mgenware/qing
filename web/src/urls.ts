/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as staticRoute from '@qing/routes/d/static';
import { appdef } from '@qing/def';

export function staticMainImage(file: string): string {
  return `${staticRoute.imgMain}/${file}`;
}

export function post(id: string) {
  return `/${appdef.routePost}/${id}`;
}
