import * as mm from 'mingru-models';
import PostCmtCore from '../post/postCmtCore';
import PostCore from '../post/postCore';
import forumPost from './forumPost';

export class ForumPostCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return forumPost;
  }
}

export default mm.table(ForumPostCmt);
