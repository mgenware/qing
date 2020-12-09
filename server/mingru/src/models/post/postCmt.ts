import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase';
import ContentCmtBase from '../com/contentCmtCore';
import post from './post';

export class PostCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return post;
  }
}

export default mm.table(PostCmt);
