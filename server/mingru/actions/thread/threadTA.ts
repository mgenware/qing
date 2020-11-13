import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/thread/thread';
import threadCmt from '../../models/thread/threadCmt';
import { updateCounterAction } from '../misc/counterColumnTAFactory';
import PostTACore from '../post/postTACore';
import userStatsTA from '../user/userStatsTA';

export class ThreadTA extends PostTACore {
  updateMsgCount = updateCounterAction(t, t.msg_count);

  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return threadCmt;
  }

  getCoreColumns(): mm.SelectActionColumns[] {
    return [t.id.privateAttr(), t.title, t.created_at, t.modified_at, t.msg_count];
  }

  getItemSourceColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getDashboardOrderInputSelections(): mm.SelectActionColumns[] {
    return [t.created_at, t.msg_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateThreadCount;
  }
}

export default mm.tableActions(t, ThreadTA);
