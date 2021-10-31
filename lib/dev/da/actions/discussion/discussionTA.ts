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

  override getBaseTable(): ContentBase {
    return t;
  }

  override getCmtBaseTable(): ContentCmtBase {
    return discussionCmt;
  }

  override getPCColumns(): mm.SelectedColumn[] {
    return [t.title, t.reply_count];
  }

  override getPCOrderByColumns(): mm.SelectedColumn[] {
    return [t.created_at, t.reply_count];
  }

  override getProfileColumns(): mm.SelectedColumn[] {
    return [t.title];
  }

  override getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  override getFullColumns(): mm.SelectedColumn[] {
    return [...super.getFullColumns(), t.title, t.cmt_count, t.reply_count];
  }

  override getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateDiscussionCount;
  }
}

export default mm.tableActions(t, DiscussionTA);
