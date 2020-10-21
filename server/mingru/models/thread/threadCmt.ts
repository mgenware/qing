import * as mm from 'mingru-models';
import PostCmtCore from '../post/postCmtCore';
import PostCore from '../post/postCore';
import thread from './thread';

export class ThreadCmt extends PostCmtCore {
  getPostTable(): PostCore {
    return thread;
  }
}

export default mm.table(ThreadCmt);
