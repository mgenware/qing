import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase';
import ContentCmtBase from '../com/contentCmtCore';
import discussion from './discussion';

export class DiscussionCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return discussion;
  }
}

export default mm.table(DiscussionCmt);
