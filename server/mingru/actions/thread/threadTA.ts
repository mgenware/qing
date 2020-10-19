import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/thread/thread';
import threadCmt from '../../models/thread/threadCmt';
import PostTACore from '../post/postTACore';
import userStatsTA from '../user/userStatsTA';

export class ThreadTA extends PostTACore {
  getPostTable(): PostCore {
    return t;
  }

  getPostCmtTable(): PostCmtCore {
    return threadCmt;
  }

  getCoreColumns(): mm.SelectActionColumns[] {
    return [t.id.privateAttr(), t.title, t.created_at, t.modified_at, t.answer_count];
  }

  getPostSourceColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getDashboardOrderInputSelections(): mm.SelectActionColumns[] {
    return [t.created_at, t.answer_count, t.cmt_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updatePostCount;
  }
}

export default mm.tableActions(t, ThreadTA);
