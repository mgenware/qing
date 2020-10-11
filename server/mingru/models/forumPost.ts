import * as mm from 'mingru-models';
import PostCore from './factory/postCore';
import forum from './forum';

export class ForumPost extends PostCore {
  title = mm.varChar(255);
  forum_id = forum.id;

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(ForumPost);
