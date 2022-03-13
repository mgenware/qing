/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentBaseCmt from '../../models/com/contentBaseCmt.js';
import t from '../../models/discussion/discussionMsg.js';
import discussionMsgCmt from '../../models/discussion/discussionMsgCmt.js';
import ContentBaseAG from '../com/contentBaseAG.js';
import { threadBaseUtilAG, threadBaseTableParam } from '../com/threadBaseUtilAG.js';

const discussionID = 'discussionID';

export class DiscussionMsgTA extends ContentBaseAG {
  selectItemsByDiscussion: mm.SelectAction;

  constructor() {
    super();

    // Remove `selectItemByID`, discussion messages are fetched along with
    // their belonging discussion.
    this.selectItemByID = mm.emptyAction;
    this.selectItemsByDiscussion = mm
      .selectRows(...this.getFullColumns())
      .pageMode()
      .by(t.discussion_id)
      .orderByAsc(t.created_at);
  }

  override getBaseTable(): ContentBase {
    return t;
  }

  override getCmtBaseTable(): ContentBaseCmt {
    return discussionMsgCmt;
  }

  // Post center is not supported.
  override getPCColumns(): mm.SelectedColumnTypes[] {
    return [];
  }

  override getPCOrderByColumns(): mm.SelectedColumnTypes[] {
    return [];
  }

  // Profile is not supported.
  override getProfileColumns(): mm.SelectedColumnTypes[] {
    return [];
  }

  override getEditingColumns(): mm.Column[] {
    return [t.content];
  }

  override getFullColumns(): mm.SelectedColumnTypes[] {
    return [...super.getFullColumns(), t.cmt_count];
  }

  override getContainerUpdateCounterActions(): mm.Action[] {
    return [
      threadBaseUtilAG.updateReplyCount.wrap({
        [threadBaseTableParam]: t,
        id: mm.captureVar(discussionID),
      }),
    ];
  }

  override getExtraInsertionInputColumns(): mm.Column[] {
    return [t.discussion_id];
  }

  override deleteItemOverride(): mm.Action | null {
    return mm.transact(
      mm
        .selectField(t.discussion_id)
        .by(t.id)
        .declareReturnValue(mm.ReturnValues.result, discussionID),
      mm.deleteOne().whereSQL(this.updateConditions),
      ...this.getDecrementContainerCounterActions(),
    );
  }
}

export default mm.actionGroup(t, DiscussionMsgTA);
