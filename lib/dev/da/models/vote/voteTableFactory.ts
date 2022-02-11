/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { TableWithID } from '../common.js';
import user from '../user/user.js';

export interface VoteTable extends mm.Table {
  user_id: mm.Column;
  host_id: mm.Column;
  vote: mm.Column;
}

export interface VotableTable extends TableWithID {
  up_votes: mm.Column;
  down_votes: mm.Column;
  votes: mm.Column;
}

export function newVoteTable(hostName: string, hostIDColumn: mm.Column): VoteTable {
  const className = `${hostName}_vote`;
  const cols = {
    user_id: mm.pk(user.id),
    host_id: mm.pk(hostIDColumn),
    vote: mm.bool(),
  };
  return mm.tableCore(className, undefined, cols) as VoteTable;
}
