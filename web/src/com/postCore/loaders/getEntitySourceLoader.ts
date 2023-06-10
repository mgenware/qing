/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import Entity from 'lib/entity.js';
import * as composeRoute from '@qing/routes/s/pri/compose.js';
import { DBEntitySrc } from 'da/types.js';

export class GetEntitySourceLoader extends Loader<DBEntitySrc> {
  constructor(public entity: Entity) {
    super();
  }

  override requestURL(): string {
    return composeRoute.entitySource;
  }

  override requestParams(): Record<string, unknown> {
    return {
      entity: this.entity,
    };
  }
}
