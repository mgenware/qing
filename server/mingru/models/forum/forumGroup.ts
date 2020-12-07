import * as mm from 'mingru-models';
import ForumCoreTable from './forumCoreTable';

export class ForumGroup extends ForumCoreTable {
  forum_count = mm.uInt().default(0);
}

export default mm.table(ForumGroup);
