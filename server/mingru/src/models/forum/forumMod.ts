import * as mm from 'mingru-models';
import user from '../user/user';
import forum from './forum';
import ForumModBase from './forumModBase';

export class ForumMod extends mm.Table implements ForumModBase {
  object_id = mm.pk(forum.id);
  user_id = mm.pk(user.id);
}

export default mm.table(ForumMod);
