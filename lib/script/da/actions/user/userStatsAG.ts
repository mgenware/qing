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
  selectStats = mm.selectRow(t.post_count, t.fpost_count).by(t.id);

  updatePostCount = uca.updateCounterAction(t, t.post_count);
  updateFPostCount = uca.updateCounterAction(t, t.fpost_count);

  testSelectPostCount = selectFieldAction(t.post_count);
  testSelectFPostCount = selectFieldAction(t.fpost_count);
  testDelete = mm.deleteSome().by(t.id);
}

export default mm.actionGroup(t, UserStatsAG);
