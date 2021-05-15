/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentCmtBase from '../../models/com/contentCmtCore.js';
import t from '../../models/discussion/discussion.js';
import discussionCmt from '../../models/discussion/discussionCmt.js';
import ThreadBaseTA from '../com/threadBaseTA.js';
import { updateCounterAction } from '../misc/counterColumnTAFactory.js';
import userStatsTA from '../user/userStatsTA.js';

export class DiscussionTA extends ThreadBaseTA {
  updateMsgCount = updateCounterAction(t, t.reply_count);

  getBaseTable(): ContentBase {
    return t;
  }

  getCmtBaseTable(): ContentCmtBase {
    return discussionCmt;
  }

  getPCColumns(): mm.SelectedColumn[] {
    return [t.title, t.reply_count];
  }

  getPCOrderByColumns(): mm.SelectedColumn[] {
    return [t.created_at, t.reply_count];
  }

  getProfileColumns(): mm.SelectedColumn[] {
    return [t.title];
  }

  getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.reply_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateDiscussionCount;
  }
}

export default mm.tableActions(t, DiscussionTA);
