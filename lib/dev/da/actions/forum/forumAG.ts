/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import fpost from '../../models/fpost/fpost.js';
import t from '../../models/forum/forum.js';
import { threadFeedCols, threadFeedType } from '../fpost/cm.js';

export class ForumAG extends mm.ActionGroup {
  selectForum = mm
    .selectRow(t.id, t.name, t.desc, t.created_at.privateAttr(), t.fpost_count)
    .by(t.id);
  selectGroupID = mm.selectField(t.group_id).by(t.id);
  selectForumIDsForGroup = mm.selectFieldRows(t.id).where`${t.group_id.isEqualToParam(undefined, {
    nullable: false,
  })}`.noOrderBy();
  selectInfoForEditing = mm.selectRow(t.name, t.desc).by(t.id);

  deleteItem = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setParams(t.name, t.desc, t.desc_src).by(t.id);
  insertItem = mm.insertOne().setParams(t.name, t.desc, t.desc_src).setParams();

  // Select posts.
  selectFPosts: mm.SelectAction;

  constructor() {
    super();

    this.selectFPosts = mm
      .selectRows(...threadFeedCols())
      .from(fpost)
      .by(fpost.forum_id)
      .pageMode()
      .orderByAsc(fpost.last_replied_at)
      .resultTypeNameAttr(threadFeedType);
  }
}

export default mm.actionGroup(t, ForumAG);
