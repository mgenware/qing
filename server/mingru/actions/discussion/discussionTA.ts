import * as mm from 'mingru-models';
import PostCmtCore from '../../models/post/postCmtCore';
import PostCore from '../../models/post/postCore';
import t from '../../models/discussion/discussion';
import discussionCmt from '../../models/discussion/discussionCmt';
import { updateCounterAction } from '../misc/counterColumnTAFactory';
import PostTACore from '../post/postTACore';
import userStatsTA from '../user/userStatsTA';

export class DiscussionTA extends PostTACore {
  updateMsgCount = updateCounterAction(t, t.msg_count);

  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return discussionCmt;
  }

  getDashboardColumns(): mm.SelectedColumn[] {
    return [t.title, t.msg_count];
  }

  getDashboardOrderByColumns(): mm.SelectedColumn[] {
    return [t.created_at, t.msg_count];
  }

  getProfileColumns(): mm.SelectedColumn[] {
    return [t.title];
  }

  getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.msg_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateDiscussionCount;
  }
}

export default mm.tableActions(t, DiscussionTA);
