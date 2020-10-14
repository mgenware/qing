import * as mm from 'mingru-models';
import thread from './thread';
import user from '../user/user';

export class Answer extends mm.Table {
  id = mm.pk();
  content = mm.text();
  user_id = user.id;
  thread_id = thread.id;

  created_at = mm.datetime('utc');
  modified_at = mm.datetime('utc').nullable;
  cmt_count = mm.uInt().default(0);

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(Answer);
