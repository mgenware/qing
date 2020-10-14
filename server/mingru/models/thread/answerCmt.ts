import * as mm from 'mingru-models';
import PostCmtCore from '../post/postCmtCore';
import PostCore from '../post/postCore';
import answer from './answer';

export class ForumPostCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return answer;
  }
}

export default mm.table(ForumPostCmt);
