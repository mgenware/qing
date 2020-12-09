import * as mm from 'mingru-models';
import ContentWithTitleBase from '../com/contentWithTitleBase';

export class Post extends ContentWithTitleBase {
  likes = mm.uInt().default(0);
}

export default mm.table(Post);
