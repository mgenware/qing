import * as mm from 'mingru-models';
import ContentBase from '../com/contentBase';
import ContentCmtBase from '../com/contentCmtCore';
import discussionMsg from './discussionMsg';

export class DiscussionMsgCmt extends ContentCmtBase {
  getHostTable(): ContentBase {
    return discussionMsg;
  }
}

export default mm.table(DiscussionMsgCmt);
