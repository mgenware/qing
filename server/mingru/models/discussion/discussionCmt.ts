import * as mm from 'mingru-models';
import PostCmtCore from '../post/postCmtCore';
import PostCore from '../post/postCore';
import discussion from './discussion';

export class DiscussionCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return discussion;
  }
}

export default mm.table(DiscussionCmt);
