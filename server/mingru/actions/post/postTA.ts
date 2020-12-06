import * as mm from 'mingru-models';
import t from '../../models/post/post';
import postCmt from '../../models/post/postCmt';
import PostTACore from './postTACore';
import PostCore from '../../models/post/postCore';
import PostCmtCore from '../../models/post/postCmtCore';
import userStatsTA from '../user/userStatsTA';

export class PostTA extends PostTACore {
  getItemTable(): PostCore {
    return t;
  }

  getItemCmtTable(): PostCmtCore {
    return postCmt;
  }

  getDashboardColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.likes];
  }

  getDashboardOrderByColumns(): mm.SelectedColumn[] {
    return [t.created_at, t.likes, t.cmt_count];
  }

  getProfileColumns(): mm.SelectedColumn[] {
    return [t.title];
  }

  getEditingColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getExtraFullColumns(): mm.SelectedColumn[] {
    return [t.title, t.cmt_count, t.likes];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updatePostCount;
  }
}

export default mm.tableActions(t, PostTA);
