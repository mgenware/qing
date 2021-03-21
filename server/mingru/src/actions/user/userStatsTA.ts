/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import { UpdateAction } from 'mingru-models';
import t from '../../models/user/userStats';

function updateCounterAction(column: mm.Column): UpdateAction {
  return mm
    .updateOne()
    .set(column, mm.sql`${column} + ${mm.int().toInput('offset')}`)
    .by(t.id, 'userID');
}

export class UserStatsTA extends mm.TableActions {
  selectStats = mm
    .selectRow(t.post_count, t.discussion_count, t.question_count, t.answer_count)
    .by(t.id);

  updatePostCount = updateCounterAction(t.post_count);
  updateDiscussionCount = updateCounterAction(t.discussion_count);
  updateQuestionCount = updateCounterAction(t.question_count);
  updateAnswerCount = updateCounterAction(t.answer_count);
}

export default mm.tableActions(t, UserStatsTA);
