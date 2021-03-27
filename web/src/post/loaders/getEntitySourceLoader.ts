/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import { CHECK } from 'checks';
import Loader from 'lib/loader';
import routes from 'routes';

export interface GetEntitySourceResult {
  title?: string;
  contentHTML: string;
}

export class GetEntitySourceLoader extends Loader<GetEntitySourceResult> {
  constructor(public entityType: number, public entityID: string) {
    super();

    CHECK(entityType);
    CHECK(entityID);
  }

  requestURL(): string {
    return routes.s.pri.compose.getEntitySource;
  }

  requestParams(): Record<string, unknown> {
    return {
      entityID: this.entityID,
      entityType: this.entityType,
    };
  }
}
