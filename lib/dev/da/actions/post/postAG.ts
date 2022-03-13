/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t from '../../models/post/post.js';
import postCmt from '../../models/post/postCmt.js';
import ContentBaseAG from '../com/contentBaseAG.js';
import userStatsAG from '../user/userStatsAG.js';

export class PostAG extends ContentBaseAG {
  override getBaseTable(): ContentBase {
    return t;
  }

  override getCmtBaseTable(): ContentBaseCmt {
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

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [userStatsAG.updatePostCount];
  }
}

export default mm.actionGroup(t, PostAG);
