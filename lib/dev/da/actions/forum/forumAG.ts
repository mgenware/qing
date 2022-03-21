/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import thread from '../../models/thread/thread.js';
import t from '../../models/forum/forum.js';
import { userThreadInterface, getUserThreadCols } from '../com/userThreadCommon.js';

export class ForumAG extends mm.ActionGroup {
  selectForum = mm
    .selectRow(t.id, t.name, t.desc, t.created_at.privateAttr(), t.thread_count)
    .by(t.id);
  selectGroupID = mm.selectField(t.group_id).by(t.id);
  selectForumIDsForGroup = mm.selectFieldRows(t.id).where`${t.group_id.isEqualToParam(undefined, {
    nullable: false,
  })}`.noOrderBy();
  selectInfoForEditing = mm.selectRow(t.name, t.desc).by(t.id);

  deleteItem = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setParams(t.name, t.desc).by(t.id);
  insertItem = mm.insertOne().setParams(t.name, t.desc).setParams();

  // Select threads.
  selectThreads: mm.SelectAction;

  constructor() {
    super();

    this.selectThreads = mm
      .selectRows(...getUserThreadCols(thread, true))
      .from(thread)
      .by(thread.forum_id)
      .pageMode()
      .orderByAsc(thread.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);
  }
}

export default mm.actionGroup(t, ForumAG);
