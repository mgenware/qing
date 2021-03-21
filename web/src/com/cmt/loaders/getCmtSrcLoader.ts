/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';

export interface GetCmtSourceResult {
  contentHTML: string;
}

export class GetCmtSourceLoader extends Loader<GetCmtSourceResult> {
  constructor(public id: string) {
    super();
  }

  requestURL(): string {
    return routes.s.pri.compose.getCmtSource;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.id,
    };
  }
}
