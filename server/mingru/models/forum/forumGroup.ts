import * as mm from 'mingru-models';
import ForumBaseEntity from './forumBaseEntity';

export class ForumGroup extends ForumBaseEntity {
  forum_count = mm.uInt().default(0);
}

export default mm.table(ForumGroup);
