/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import Entity from 'lib/entity';
import * as composeRoute from '@qing/routes/d/s/pri/compose';
import { EntityGetSrcResult } from 'sod/da/types';

export class GetEntitySourceLoader extends Loader<EntityGetSrcResult> {
  constructor(public entity: Entity) {
    super();
  }

  requestURL(): string {
    return composeRoute.entitySource;
  }

  requestParams(): Record<string, unknown> {
    return {
      entity: this.entity,
    };
  }
}
