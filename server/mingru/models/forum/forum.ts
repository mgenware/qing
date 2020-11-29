import * as mm from 'mingru-models';
import ForumCoreTable from './forumCoreTable';
import forumGroup from './forumGroup';

export class Forum extends ForumCoreTable {
  group_id = forumGroup.id;
  thread_count = mm.uInt().default(0);
}

export default mm.table(Forum);
