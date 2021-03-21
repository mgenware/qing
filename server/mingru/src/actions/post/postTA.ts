/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can be
 * found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase';
import ContentCmtBase from '../../models/com/contentCmtCore';
import t from '../../models/post/post';
import postCmt from '../../models/post/postCmt';
import ContentBaseTA from '../com/contentBaseTA';
import userStatsTA from '../user/userStatsTA';

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
