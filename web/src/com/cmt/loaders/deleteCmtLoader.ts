/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import Loader from 'lib/loader';
import * as composeRoute from '@qing/routes/s/pri/compose';
import Entity from 'lib/entity';

export default class DeleteCmtLoader extends Loader<string> {
  constructor(public id: string | null, public host: Entity) {
    super();
  }

  override requestURL(): string {
    return composeRoute.delCmt;
  }

  override requestParams(): Record<string, unknown> {
    return {
      id: this.id,
      hostType: this.host.type,
      hostID: this.host.id,
    };
  }
}
