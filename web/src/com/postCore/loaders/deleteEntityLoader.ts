/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';
import Entity from 'lib/entity';

export default class DeleteEntityLoader extends Loader<string> {
  constructor(public entity: Entity) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.deleteEntity;
  }

  requestParams(): Record<string, unknown> {
    return {
      entity: this.entity,
    };
  }
}
