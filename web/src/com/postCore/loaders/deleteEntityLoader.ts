/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader.js';
import * as composeRoute from '@qing/routes/s/pri/compose.js';
import Entity from 'lib/entity.js';

export default class DeleteEntityLoader extends Loader<string> {
  constructor(public entity: Entity) {
    super();
  }

  override requestURL(): string {
    return composeRoute.delEntity;
  }

  override requestParams(): Record<string, unknown> {
    return {
      entity: this.entity,
    };
  }
}
