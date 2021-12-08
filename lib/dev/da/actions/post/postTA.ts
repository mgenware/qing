/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentCmtBase from '../../models/com/contentCmtCore.js';
import t from '../../models/post/post.js';
import postCmt from '../../models/post/postCmt.js';
import ContentBaseTA from '../com/contentBaseTA.js';
import userStatsTA from '../user/userStatsTA.js';

export class PostTA extends ContentBaseTA {
  override getBaseTable(): ContentBase {
    return t;
  }

  override getCmtBaseTable(): ContentCmtBase {
    return postCmt;
  }

  override getPCColumns(): mm.SelectedColumnTypes[] {
    return [t.title, t.cmt_count, t.likes];
  }

  override getPCOrderByColumns(): mm.SelectedColumnTypes[] {
    return [t.created_at, t.likes, t.cmt_count];
  }

  override getProfileColumns(): mm.SelectedColumnTypes[] {
    return [t.title];
  }

  override getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  override getFullColumns(): mm.SelectedColumnTypes[] {
    return [...super.getFullColumns(), t.title, t.cmt_count, t.likes];
  }

  override getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updatePostCount;
  }
}

export default mm.tableActions(t, PostTA);
