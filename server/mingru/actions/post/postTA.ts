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

  getCoreColumns(): mm.SelectActionColumns[] {
    return [t.id.privateAttr(), t.title, t.created_at, t.modified_at, t.cmt_count, t.likes];
  }

  getItemSourceColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getDashboardOrderInputSelections(): mm.SelectActionColumns[] {
    return [t.created_at, t.likes, t.cmt_count];
  }

  getContainerUpdateCounterAction(): mm.Action {
    return userStatsTA.updatePostCount;
  }
}

export default mm.tableActions(t, PostTA);
