import * as mm from 'mingru-models';
import forumPostCmt from '../models/forumPostCmt';
import PostCore from '../models/factory/postCore';
import t from '../models/forumPost';
import PostCmtCore from '../models/factory/postCmtCore';
import PostTACore from './factory/postTACore';

export class ForumPostTA extends PostTACore {
  getPostTable(): PostCore {
    return t;
  }

  getPostCmtTable(): PostCmtCore {
    return forumPostCmt;
  }

  getCoreColumns(): mm.SelectActionColumns[] {
    return [t.id.privateAttr(), t.title, t.created_at, t.modified_at, t.cmt_count, t.votes];
  }

  getPostSourceColumns(): mm.Column[] {
    return [t.title, t.content];
  }

  getDashboardOrderInputSelections(): mm.SelectActionColumns[] {
    return [t.created_at, t.votes, t.cmt_count];
  }

  getExtraInsertionInputColumns(): mm.Column[] {
    return [t.forum_id];
  }
}

export default mm.tableActions(t, ForumPostTA);
