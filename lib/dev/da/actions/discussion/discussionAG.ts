/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t from '../../models/discussion/discussion.js';
import discussionCmt from '../../models/discussion/discussionCmt.js';
import ThreadBaseAG from '../com/threadBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class DiscussionAG extends ThreadBaseAG {
  override getBaseTable(): ContentBase {
    return t;
  }

  override getCmtBaseTable(): ContentBaseCmt {
    return discussionCmt;
  }

  override getPCColumns(): mm.SelectedColumnTypes[] {
    return [t.title, t.reply_count];
  }

  override getPCOrderByColumns(): mm.SelectedColumnTypes[] {
    return [t.created_at, t.reply_count];
  }

  override getProfileColumns(): mm.SelectedColumnTypes[] {
    return [t.title];
  }

  override getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  override getFullColumns(): mm.SelectedColumnTypes[] {
    return [...super.getFullColumns(), t.title, t.cmt_count, t.reply_count];
  }

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [userStatsAG.updateDiscussionCount];
  }
}

export default mm.actionGroup(t, DiscussionAG);
