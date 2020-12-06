import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/discussion/discussionMsg';
import discussionMsgCmt from '../../models/discussion/discussionMsgCmt';
import PostTACore from '../post/postTACore';
import discussionTA from './discussionTA';

const discussionID = 'discussionID';

export class DiscussionMsgTA extends PostTACore {
  selectItemsByDiscussion: mm.SelectAction;

  constructor() {
    super();

    // Remove `selectItemByID`, discussion messages are fetched along with
    // their belonging discussion.
    this.selectItemByID = mm.emptyAction as mm.SelectAction;
    this.selectItemsByDiscussion = mm
      .selectPage(...this.getFullColumns())
      .by(t.discussion_id)
      .orderByAsc(t.created_at);
  }

  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return discussionMsgCmt;
  }

  // Dashboard is not supported.
  getDashboardColumns(): mm.SelectedColumn[] {
    return [];
  }

  getDashboardOrderByColumns(): mm.SelectedColumn[] {
    return [];
  }

  // Profile is not supported.
  getProfileColumns(): mm.SelectedColumn[] {
    return [];
  }

  getEditingColumns(): mm.Column[] {
    return [t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.cmt_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return discussionTA.updateMsgCount.wrap({ id: mm.valueRef(discussionID), offset: '-1' });
  }

  getExtraInsertionInputColumns(): mm.Column[] {
    return [t.discussion_id];
  }

  deleteItemOverride(): mm.Action | null {
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
