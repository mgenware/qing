import * as mm from 'mingru-models';
import ForumBase from './forumBase';
import forumGroup from './forumGroup';

export class Forum extends ForumBase {
  group_id = mm.fk(forumGroup.id).nullable;
  thread_count = mm.uInt().default(0);
  status = mm.uTinyInt().default(0);
}

export default mm.table(Forum);
