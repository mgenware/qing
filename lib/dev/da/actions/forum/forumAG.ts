/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import discussion from '../../models/discussion/discussion.js';
import t from '../../models/forum/forum.js';
import question from '../../models/qna/question.js';
import {
  getUserDiscussionCols,
  getUserQuestionCols,
  userThreadInterface,
  userThreadTypeColumnName,
} from '../com/userThreadCommon.js';
import { dbDef } from '@qing/def';

export class ForumAG extends mm.ActionGroup {
  selectForum = mm
    .selectRow(t.id, t.name, t.desc, t.created_at.privateAttr(), t.thread_count)
    .by(t.id);
  selectGroupID = mm.selectField(t.group_id).by(t.id);
  selectForumIDsForGroup = mm.selectFieldRows(t.id).where`${t.group_id.isEqualToInput(undefined, {
    nullable: false,
  })}`.noOrderBy();
  selectInfoForEditing = mm.selectRow(t.name, t.desc).by(t.id);

  deleteItem = mm.deleteOne().by(t.id);
  updateInfo = mm.updateOne().setInputs(t.name, t.desc).by(t.id);
  insertItem = mm.insertOne().setInputs(t.name, t.desc).setInputs();

  // Select threads.
  selectThreads: mm.SelectAction;
  selectDiscussions: mm.SelectAction;
  selectQuestions: mm.SelectAction;

  constructor() {
    super();

    this.selectDiscussions = mm
      .selectRows(this.typeCol(dbDef.ThreadType.dis), ...getUserDiscussionCols(discussion, true))
      .from(discussion)
      .by(discussion.forum_id)
      .pageMode()
      .orderByAsc(discussion.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);
    this.selectQuestions = mm
      .selectRows(this.typeCol(dbDef.ThreadType.que), ...getUserQuestionCols(question, true))
      .from(question)
      .by(question.forum_id)
      .pageMode()
      .orderByAsc(question.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);

    this.selectThreads = this.selectDiscussions
      .union(this.selectQuestions)
      .pageMode()
      .orderByDesc(discussion.last_replied_at)
      .resultTypeNameAttr(userThreadInterface);
  }

  private typeCol(itemType: number): mm.SelectedColumn {
    return new mm.SelectedColumn(
      mm.sql`${itemType.toString()}`,
      userThreadTypeColumnName,
      mm.int().__type(),
    );
  }
}

export default mm.actionGroup(t, ForumAG);
