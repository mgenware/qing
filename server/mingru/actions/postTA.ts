import * as mm from 'mingru-models';
import t from '../models/post';
import postCmt from '../models/postCmt';
import PostTACore from './factory/postTACore';
import PostCore from '../models/factory/postCore';
import PostCmtCore from '../models/factory/postCmtCore';
import userStatsTA from './userStatsTA';

export class PostTA extends PostTACore {
  getPostTable(): PostCore {
    return t;
  }

  getPostCmtTable(): PostCmtCore {
    return postCmt;
  }

  getCoreColumns(): mm.SelectActionColumns[] {
    return [t.id.privateAttr(), t.title, t.created_at, t.modified_at, t.cmt_count, t.likes];
  }

  getPostSourceColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getDashboardOrderInputSelections(): mm.SelectActionColumns[] {
    return [t.created_at, t.likes, t.cmt_count];
  }

  getUserStatsUpdateCounterAction(): mm.Action {
    return userStatsTA.updatePostCount;
  }
}

export default mm.tableActions(t, PostTA);
