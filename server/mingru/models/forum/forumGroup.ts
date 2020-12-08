import * as mm from 'mingru-models';
import ForumBase from './forumBase';

export class ForumGroup extends ForumBase {
  forum_count = mm.uInt().default(0);
}

export default mm.table(ForumGroup);
