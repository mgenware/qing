/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import Entity from 'lib/entity';
import routes from 'routes';

export interface GetEntitySourceResult {
  title?: string;
  contentHTML: string;
}

export class GetEntitySourceLoader extends Loader<GetEntitySourceResult> {
  constructor(public entity: Entity) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.entitySource;
  }

  requestParams(): Record<string, unknown> {
    return {
      entity: this.entity,
    };
  }
}
