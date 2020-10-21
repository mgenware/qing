import * as mm from 'mingru-models';
import thread from './thread';
import PostCore from '../post/postCore';

export class ThreadMsg extends PostCore {
  thread_id = thread.id;

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(ThreadMsg);
