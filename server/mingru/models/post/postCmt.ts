import * as mm from 'mingru-models';
import PostCmtCore from './postCmtCore';
import PostCore from './postCore';
import post from './post';

export class PostCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return post;
  }
}

export default mm.table(PostCmt);
