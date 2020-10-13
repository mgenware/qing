import * as mm from 'mingru-models';
import ForumBaseEntity from './forumBaseEntity';
import forumGroup from './forumGroup';

export class Forum extends ForumBaseEntity {
  group_id = forumGroup.id;
  post_count = mm.uInt().default(0);
}

export default mm.table(Forum);
