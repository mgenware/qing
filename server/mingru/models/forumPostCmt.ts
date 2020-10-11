import * as mm from 'mingru-models';
import PostCmtCore from './factory/postCmtCore';
import PostCore from './factory/postCore';
import forumPost from './forumPost';

export class ForumPostCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return forumPost;
  }
}

export default mm.table(ForumPostCmt);
