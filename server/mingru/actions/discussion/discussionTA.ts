import * as mm from 'mingru-models';
import ContentBase from '../../models/com/contentBase';
import ContentCmtBase from '../../models/com/contentCmtCore';
import t from '../../models/discussion/discussion';
import discussionCmt from '../../models/discussion/discussionCmt';
import ThreadBaseTA from '../com/threadBaseTA';
import { updateCounterAction } from '../misc/counterColumnTAFactory';
import userStatsTA from '../user/userStatsTA';

export class DiscussionTA extends ThreadBaseTA {
  updateMsgCount = updateCounterAction(t, t.reply_count);

  getBaseTable(): ContentBase {
    return t;
  }

  getCmtBaseTable(): ContentCmtBase {
    return discussionCmt;
  }

  getDashboardColumns(): mm.SelectedColumn[] {
    return [t.title, t.reply_count];
  }

  getDashboardOrderByColumns(): mm.SelectedColumn[] {
    return [t.created_at, t.reply_count];
  }

  getProfileColumns(): mm.SelectedColumn[] {
    return [t.title];
  }

  getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.reply_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updateDiscussionCount;
  }
}

export default mm.tableActions(t, DiscussionTA);
