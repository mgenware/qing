import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/thread/threadMsg';
import threadMsgCmt from '../../models/thread/threadMsgCmt';
import PostTACore from '../post/postTACore';
import threadTA from './threadTA';

export class ThreadMsgTA extends PostTACore {
  selectItemsByThread: mm.SelectAction;

  constructor() {
    super();

    // Remove `selectItemByID`, thread messages are fetched along with their belonging thread.
    this.selectItemByID = mm.emptyAction as mm.SelectAction;
    this.selectItemsByThread = mm.selectPage(...this.getFullColumns()).orderByAsc(t.created_at);
  }

  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return threadMsgCmt;
  }

  getCoreColumns(): mm.SelectActionColumns[] {
    return [t.id.privateAttr(), t.created_at, t.modified_at, t.cmt_count];
  }

  getItemSourceColumns(): mm.Column[] {
    return [t.content];
  }

  getDashboardOrderInputSelections(): mm.SelectActionColumns[] {
    return [t.created_at, t.cmt_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return threadTA.updateMsgCount;
  }

  getExtraInsertionInputColumns(): mm.Column[] {
    return [t.thread_id];
  }
}

export default mm.tableActions(t, ThreadMsgTA);
