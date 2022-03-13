/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import post from '../../models/post/post.js';
import discussion from '../../models/discussion/discussion.js';
import forumGroup, { ForumGroup } from '../../models/forum/forumGroup.js';
import forum, { Forum } from '../../models/forum/forum.js';
import question from '../../models/qna/question.js';
import sharedDefs from '../../shared_constants.js';
import {
  getUserPostCols,
  userThreadInterface,
  getUserQuestionCols,
  getUserDiscussionCols,
  userThreadTypeColumnName,
} from '../com/userThreadCommon.js';

export class Home extends mm.GhostTable {}

export class HomeAG extends mm.ActionGroup {
  // Non-forum mode.
  selectPosts: mm.SelectAction;
  selectDiscussions: mm.SelectAction;
  selectQuestions: mm.SelectAction;
  selectItems: mm.SelectAction;

  // Forum mode.
  selectForumGroups = mm
    .selectRows(...this.getForumGroupCols(forumGroup))
    .from(forumGroup)
    .orderByDesc(forumGroup.order_index);
  selectForums = mm
    .selectRows(...this.getForumCols(forum))
    .from(forum)
    .noOrderBy();

  constructor() {
    super();

    this.selectPosts = mm
      .selectRows(this.typeCol(sharedDefs.threadTypePost), ...getUserPostCols(post))
      .from(post)
      .pageMode()
      .orderByAsc(post.created_at)
      .resultTypeNameAttr(userThreadInterface);
    this.selectQuestions = mm
      .selectRows(
        this.typeCol(sharedDefs.threadTypeQuestion),
        ...getUserQuestionCols(question, false),
      )
      .from(question)
      .pageMode()
      .orderByAsc(question.created_at)
      .resultTypeNameAttr(userThreadInterface);
    this.selectDiscussions = mm
      .selectRows(
        this.typeCol(sharedDefs.threadTypeDiscussion),
        ...getUserDiscussionCols(discussion, false),
      )
      .pageMode()
      .from(discussion)
      .orderByAsc(discussion.created_at)
      .resultTypeNameAttr(userThreadInterface);

    this.selectItems = this.selectPosts
      .union(this.selectQuestions)
      .union(this.selectDiscussions)
      .orderByDesc(post.created_at)
      .pageMode()
      .resultTypeNameAttr(userThreadInterface);
  }

  private typeCol(itemType: number): mm.SelectedColumn {
    return new mm.SelectedColumn(
      mm.sql`${itemType.toString()}`,
      userThreadTypeColumnName,
      mm.int().__type(),
    );
  }

  private getForumGroupCols(t: ForumGroup): mm.SelectedColumnTypes[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.forum_count, t.desc];
  }

  private getForumCols(t: Forum): mm.SelectedColumnTypes[] {
    return [t.id.privateAttr(), t.name, t.order_index, t.thread_count, t.group_id];
  }
}

export default mm.actionGroup(mm.table(Home, { virtualTable: true }), HomeAG);
