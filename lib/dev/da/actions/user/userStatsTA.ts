/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import t from '../../models/user/userStats.js';
import * as uca from '../com/updateCounterAction.js';

function selectFieldAction(col: mm.Column): mm.SelectAction {
  return mm.selectField(col).by(t.id);
}

export class UserStatsTA extends mm.TableActions {
  selectStats = mm
    .selectRow(t.post_count, t.discussion_count, t.question_count, t.answer_count)
    .by(t.id);

  updatePostCount = uca.updateCounterAction(t, t.post_count);
  updateDiscussionCount = uca.updateCounterAction(t, t.discussion_count);
  updateQuestionCount = uca.updateCounterAction(t, t.question_count);
  updateAnswerCount = uca.updateCounterAction(t, t.answer_count);

  testSelectPostCount = selectFieldAction(t.post_count);
  testSelectDiscussionCount = selectFieldAction(t.discussion_count);
  testSelectQuestionCount = selectFieldAction(t.question_count);
  testSelectAnswerCount = selectFieldAction(t.answer_count);
}

export default mm.tableActions(t, UserStatsTA);
