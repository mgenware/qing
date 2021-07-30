/*
 * Copyright (C) 2021 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import { newVoteTable, VoteTable, VotableTable } from './voteTableFactory.js';
import answer from '../qna/answer.js';

function notNull<T>(val: T | null | undefined): T {
  if (val === null || val === undefined) {
    throw new Error('Unexpected nullable value');
  }
  return val;
}

const hostTables = [answer];

const votableTables = new Map<VotableTable, VoteTable>(
  hostTables.map((hostTable) => [
    hostTable,
    newVoteTable(hostTable.__getData().name, hostTable.id),
  ]),
);

export default votableTables;
export const answerVote = notNull(votableTables.get(answer));
