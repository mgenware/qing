/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as voteRoute from '@qing/routes/s/pri/vote';
import { CHECK } from 'checks';

export class VoteLoader extends Loader<string> {
  constructor(public id: string, public value: number) {
    super();
    CHECK(id);
  }

  requestURL(): string {
    return voteRoute.vote;
  }

  requestParams(): Record<string, unknown> {
    return {
      id: this.id,
      value: +this.value,
    };
  }
}
