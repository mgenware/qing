import * as mm from 'mingru-models';
import user from '../user/user';
import forumGroup from './forumGroup';
import ForumModBase from './forumModBase';

export class ForumGroupMod extends mm.Table implements ForumModBase {
  object_id = mm.pk(forumGroup.id);
  user_id = mm.pk(user.id);
}

export default mm.table(ForumGroupMod);
