/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import routes from 'routes';
import { CHECK } from 'checks';

export class VoteLoader extends Loader<string> {
  constructor(public id: string, public value: number) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return routes.s.pri.like.set;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.id,
      value: +this.value,
    };
  }
}
