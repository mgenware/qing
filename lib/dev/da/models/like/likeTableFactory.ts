/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithID } from '../common.js';
import user from '../user/user.js';

export interface LikeTable extends mm.Table {
  user_id: mm.Column;
  host_id: mm.Column;
}

export interface LikeableTable extends TableWithID {
  likes: mm.Column;
}

export function newLikeTable(hostName: string, hostIDColumn: mm.Column): LikeTable {
  const className = `${hostName}_like`;
  const cols = {
    user_id: mm.pk(user.id),
    host_id: mm.pk(hostIDColumn),
  };
  return mm.tableCore(className, undefined, cols) as LikeTable;
}
