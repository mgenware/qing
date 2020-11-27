import * as mm from 'mingru-models';
import PostCmtCore from '../post/postCmtCore';
import PostCore from '../post/postCore';
import discussionMsg from './discussionMsg';

export class DiscussionMsgCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return discussionMsg;
  }
}

export default mm.table(DiscussionMsgCmt);
