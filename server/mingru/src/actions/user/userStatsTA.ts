/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/user/userStats';

function updateCounterAction(column: mm.Column): mm.UpdateAction {
  return mm
    .updateOne()
    .set(column, mm.sql`${column} + ${mm.int().toInput('offset')}`)
    .by(t.id, 'userID');
}

function selectFieldAction(col: mm.Column): mm.SelectAction {
  return mm.selectField(col).by(t.id);
}

export class UserStatsTA extends mm.TableActions {
  selectStats = mm
    .selectRow(t.post_count, t.discussion_count, t.question_count, t.answer_count)
    .by(t.id);

  updatePostCount = updateCounterAction(t.post_count);
  updateDiscussionCount = updateCounterAction(t.discussion_count);
  updateQuestionCount = updateCounterAction(t.question_count);
  updateAnswerCount = updateCounterAction(t.answer_count);

  testSelectPostCount = selectFieldAction(t.post_count);
  testSelectDiscussionCount = selectFieldAction(t.discussion_count);
  testSelectQuestionCount = selectFieldAction(t.question_count);
  testSelectAnswerCount = selectFieldAction(t.answer_count);
}

export default mm.tableActions(t, UserStatsTA);
