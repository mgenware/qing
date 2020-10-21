import * as mm from 'mingru-models';
import PostCmtCore from '../post/postCmtCore';
import PostCore from '../post/postCore';
import threadMsg from './threadMsg';

export class ForumPostCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return threadMsg;
  }
}

export default mm.table(ForumPostCmt);
