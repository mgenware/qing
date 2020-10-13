import * as mm from 'mingru-models';
import PostCore from './postCore';

export class Post extends PostCore {
  title = mm.varChar(255);
  likes = mm.uInt().default(0);
}

export default mm.table(Post);
