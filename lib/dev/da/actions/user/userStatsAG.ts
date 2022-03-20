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

export class UserStatsAG extends mm.ActionGroup {
  selectStats = mm.selectRow(t.post_count, t.thread_count, t.thread_msg_count).by(t.id);

  updatePostCount = uca.updateCounterAction(t, t.post_count);
  updateThreadCount = uca.updateCounterAction(t, t.thread_count);
  updateThreadMsgCount = uca.updateCounterAction(t, t.thread_msg_count);

  testSelectPostCount = selectFieldAction(t.post_count);
  testSelectThreadCount = selectFieldAction(t.thread_count);
  testSelectAnswerCount = selectFieldAction(t.thread_msg_count);
}

export default mm.actionGroup(t, UserStatsAG);
