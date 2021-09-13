/*
 * Copyright (C) 2019 The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase.js';
import ContentCmtBase from '../../models/com/contentCmtCore.js';
import t from '../../models/discussion/discussionMsg.js';
import discussionMsgCmt from '../../models/discussion/discussionMsgCmt.js';
import ContentBaseTA from '../com/contentBaseTA.js';
import discussionTA from './discussionTA.js';

const discussionID = 'discussionID';

export class DiscussionMsgTA extends ContentBaseTA {
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

  override getCmtBaseTable(): ContentCmtBase {
    return discussionMsgCmt;
  }

  // Post center is not supported.
  override getPCColumns(): mm.SelectedColumn[] {
    return [];
  }

  override getPCOrderByColumns(): mm.SelectedColumn[] {
    return [];
  }

  // Profile is not supported.
  override getProfileColumns(): mm.SelectedColumn[] {
    return [];
  }

  override getEditingColumns(): mm.Column[] {
    return [t.content];
  }

  override getFullColumns(): mm.SelectedColumn[] {
    return [...super.getFullColumns(), t.cmt_count];
  }

  override getContainerUpdateCounterAction(): mm.Action {
    return discussionTA.updateMsgCount.wrap({ id: mm.valueRef(discussionID), offset: '-1' });
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
      this.getContainerUpdateCounterAction(),
    );
  }
}

export default mm.tableActions(t, DiscussionMsgTA);
