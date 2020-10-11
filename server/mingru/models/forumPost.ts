import * as mm from 'mingru-models';
import PostCore from './factory/postCore';

export class ForumPost extends PostCore {
  title = mm.varChar(255);

  votes = mm.uInt().default(0);
  up_votes = mm.uInt().default(0);
  down_votes = mm.uInt().default(0);
}

export default mm.table(ForumPost);
