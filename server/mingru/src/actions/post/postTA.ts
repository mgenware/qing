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
  getBaseTable(): ContentBase {
    return t;
  }

  getCmtBaseTable(): ContentCmtBase {
    return postCmt;
  }

  getPCColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.likes];
  }

  getPCOrderByColumns(): mm.SelectedColumn[] {
    return [t.created_at, t.likes, t.cmt_count];
  }

  getProfileColumns(): mm.SelectedColumn[] {
    return [t.title];
  }

  getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.likes];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updatePostCount;
  }
}

export default mm.tableActions(t, PostTA);
