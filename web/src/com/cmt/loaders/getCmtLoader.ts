/*
 * Copyright (C) 2022 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as entRoute from '@qing/routes/s/pub/ent';
import { Cmt } from '../data/cmt';

export default class GetCmtLoader extends Loader<Cmt | null> {
  constructor(public id: string) {
    super();
  }

  override requestURL(): string {
    return entRoute.cmt;
  }

  override requestParams(): Record<string, unknown> {
    return {
      id: this.id,
    };
  }
}
