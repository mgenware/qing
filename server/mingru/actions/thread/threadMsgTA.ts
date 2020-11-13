import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/thread/threadMsg';
import threadMsgCmt from '../../models/thread/threadMsgCmt';
import PostTACore from '../post/postTACore';
import threadTA from './threadTA';

const threadID = 'threadID';

export class ThreadMsgTA extends PostTACore {
  selectItemsByThread: mm.SelectAction;

  constructor() {
    super();

    // Remove `selectItemByID`, thread messages are fetched along with their belonging thread.
    this.selectItemByID = mm.emptyAction as mm.SelectAction;
    this.selectItemsByThread = mm
      .selectPage(...this.getFullColumns())
      .by(t.thread_id)
      .orderByAsc(t.created_at);
  }

  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return threadMsgCmt;
  }

  // Dashboard is not supported in thread msg.
  getDashboardColumns(): mm.SelectActionColumns[] {
    return [];
  }

  getDashboardOrderByColumns(): mm.SelectActionColumns[] {
    return [];
  }

  // Profile is not supported in thread msg.
  getProfileColumns(): mm.SelectActionColumns[] {
    return [];
  }

  getEditingColumns(): mm.Column[] {
    return [t.content];
  }

  getExtraFullColumns(): mm.SelectActionColumns[] {
    return [t.cmt_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return threadTA.updateMsgCount.wrap({ id: mm.valueRef('threadID'), offset: '-1' });
  }

  getExtraInsertionInputColumns(): mm.Column[] {
    return [t.thread_id];
  }

  deleteItemOverride(): mm.Action | null {
    return mm.transact(
      mm.selectField(t.thread_id).by(t.id).declareReturnValue(mm.ReturnValues.result, threadID),
      mm.deleteOne().whereSQL(this.updateConditions),
      this.getContainerUpdateCounterAction(),
    );
  }
}

export default mm.tableActions(t, ThreadMsgTA);
